const supertest = require('supertest');
const app = require('../app');
const {expect} = require('chai');

describe('GET /apps', ()=>{
    it('should return an array of playstore', ()=>{
        return supertest(app)
        .get('/apps')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).that.be.an('array');
            expect(res.body).to.have.lengthOf.at.least(1);
            const app =res.body[0];
            expect(app).to.include.all.keys(
                'App', 'Rating', 'Genre'
            );
        })
    })
    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'MISTAKE' })
          .expect(400, 'Sort must be one of title or rank');
      });

      it('Should sort by App', ()=>{
          return  supertest(app)
          .get('/apps')
          .query({sort: 'App'})
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res =>{
              expect(res.body).to.be.an('array');
              let sorted = true;

              let i =0;
              while (i<res.body.length - 1){
                  const appAtI = res.body[i];
                  const appAtIPlus1 = res.body[i+1];
                  if(appAtIPlus1.title < appAtI.title){
                      sorted = false;
                      break;
                  }
                  i++
              }
              expect(sorted).to.be.true;
          })
      })

})
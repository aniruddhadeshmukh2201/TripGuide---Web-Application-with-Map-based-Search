let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../app");
var mongoose = require('mongoose');
var should = chai.should();

chai.use(chaiHttp);


describe('API', () => {
    before(function() {
        mongoose.connect("mongodb://localhost/yelp_camp_v12", { useNewUrlParser: true, useUnifiedTopology: true  });
    });
    after(function() {
        mongoose.connection.close();
    });
    /**
     * Test the GET route
     */
    describe("GET /spots", () => {
        it("It should GET all the spots", (done) => {
            chai.request(server)
                .get("/spots")
                .end((err, response) => {
                    // should.exist(response.body);
                    response.should.have.status(200);
                    // should(response.body).length.be.eq(2);
                done();
                });
        });
        it("It should NOT GET all the spots", (done) => {
            chai.request(server)
                .get("/spot")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });
    });

    describe("GET /spots/:id", () => {
        it("It should GET a spot", (done) => {
            chai.request(server)
                .get("/spots/" + "60ffcfd85c03541c905a8e4a")
                .end((err, response) => {
                    // should.exist(response.body);
                    response.should.have.status(200);
                    // should(response.body).length.be.eq(2);
                done();
                });
        });
        it("It should NOT GET a spot", (done) => {
            chai.request(server)
                .get("/spot")
                .end((err, response) => {
                    response.should.have.status(404);
                done();
                });
        });
    });
    describe("POST /spots/", () => {
        it("It should POST a new spot", (done) => {
            const spot = {
                name: "Mumbai",
                location: "Mumbai, Maharashtra",
                description: "Very popular place",
                price: 34
            };
            chai.request(server)                
                .post("/spots/")
                .send(spot)
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('object');
                    response.body.should.have.property('name').eq("Mumbai");
                    response.body.should.have.property('location').eq("Mumbai, Maharashtra");
                done();
                });
        });

        it("It should NOT POST a new task without the name property", (done) => {
            const spot = {
                
            };
            chai.request(server)                
                .post("/spot/")
                .send(spot)
                .end((err, response) => {
                    response.should.have.status(404);
                    // response.text.should.be.eq("The name should be at least 3 chars long!");
                done();
                });
        });

    });

});


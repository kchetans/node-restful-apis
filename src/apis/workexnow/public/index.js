

const publicRoutes = require('express').Router();
import userProfile from "../../../data-manager/UserProfileDataManager";
import jobData from "../../../data-manager/Jobs";
import uiUserProfile from "../../../ui-manager/users";

publicRoutes.get('/profile/:id', (req, res)=>{
    let id = req.params.id;

    let user;
    
    userProfile.getProfile(id, 'public')
        .then((data)=>{
            res.send(data);
        });
});


publicRoutes.get('/job/:id', (req, res)=>{
    let id = req.params.id;

    let job;

    try{
        jobData.findOrFail({_id: id})
            .then((data)=>{
                res.send({data:data});
            })
    }
    catch(err){
        res.send({data: "Nothing is coming", err: err});
    }

});

export default publicRoutes;
const express = require('express');
const app = express();


const UsersSchema = require('./userSchema');
const ServicesSchema = require('./serviceSchema');

app.get("/user/getservices/:id/:skip/:limit", async (req, res) => {
    const { id, skip, limit } = req.params
    try{
        const user = await UsersSchema.findById(id,{services:1,_id:0}).populate({
            path: "services",
            select: "serviceName serviceBrief serviceTags  serviceCost serviceCostDuration serviceCostCurrency serviceDeadline rating",
            options: { limit: parseInt(limit), skip: parseInt(skip) }
        })
        return res.status(200).send(user.services)
    }catch(err){
        console.log(err)
        return res.status(403).send("An error occured")
    }

})

app.get("/user/getrooms/:userId/:page", async (req, res) => {
    const { userId, page } = req.params;
    try {
        const user = await UsersSchema.findById(userId, { chatRooms: 1, _id: 0 }).populate({
            path: "chatRooms",
            select: "service serviceProvider client proposalStatus",
            options: { limit: 10, skip: (parseInt(page) - 1) * 10 },
            populate: [
                { path: "service", select: "serviceName serviceStatus" },
                { path: "serviceProvider", select: "username profilePic" },
                { path: "client", select: "username profilePic" }
            ]
        });
        return res.status(200).send(user.chatRooms);
    } catch (err) {
        console.log(err);
        return res.status(403).send("invalid token");
    }
});

app.get("/user/getabout/:id", async (req, res) => {
    const { id } = req.params
    try{
        const user = await UsersSchema.findById(id)
        return res.status(200).send(user)
    }catch(err){
        return res.status(403).send("invalid token")
    }
})



app.put("/user/updateabout/:id", async (req, res) => {
    const { id } = req.params
    const { about,education,achievements } = req.body
    try{
        const result = await UsersSchema.findOneAndUpdate({ _id: id }, { about,education,achievements })
        return res.status(204).send("ok")
    }catch(err){
        return res.status(403).send("invalid token")
    }
})

app.get("/user/getbasic/:id", async (req, res) => {
    const { id } = req.params
    try{
        const user = await UsersSchema.findById(id,{fullname:1,_id:0,email:1,phone:1,location:1,username:1,skills:1})
        res.status(200).send(user)
    }catch(err){
        return res.status(403).send("invalid token")
    }
})

app.put("/user/updatebasic/:id", async (req, res) => {
    const { id } = req.params
    const { fullname, location,skills } = req.body
    try{
        const result = await UsersSchema.findOneAndUpdate({ _id: id }, { fullname, location,skills:skills })
        return res.status(204).send("ok")
    }catch(err){
        return res.status(403).send("invalid token")
    }
})
app.get("/user/getcontact/:id", async (req, res) => {
    const { id } = req.params
    try{
        const user = await UsersSchema.findById(id,{payment:1,_id:0,socials:1,phone:1,email:1,location:1,personalSite:1})
        console.log(user)
        res.status(200).send(user)
    }catch(err){
        return res.status(403).send("invalid token")
    }
})

app.put("/user/updatecontact/:id", async (req, res) => {
    const { id } = req.params
    const { payments, socials } = req.body
    try{
        const result = await UsersSchema.findOneAndUpdate({ _id: id }, { payment:payments, socials })
        return res.status(204).send("ok")
    }catch(err){
        return res.status(403).send("invalid token")
    }
})

app.get("/user/getworkhistory/:id", async (req, res) => {
    const { id } = req.params
    try{
        const user = await UsersSchema.findById(id,{workHistory:1,_id:0})
        res.status(200).send(user)
    }catch(err){
        return res.status(403).send("invalid token")
    }
})
app.get("/user/getprofiletags/:id", async (req, res) => {
    const { id } = req.params
    try{
        const user = await UsersSchema.findById(id,{profileTags:1,_id:0})
        res.status(200).send(user)
    }
    catch(err){
        return res.status(403).send("invalid token")
    }
})

app.put("/user/updateprofiletags/:id", async (req, res) => {
    const { id } = req.params
    const { profileTags } = req.body
    try{
        const result = await UsersSchema.findOneAndUpdate({ _id: id }, { profileTags })
        return res.status(204).send("ok")
    }catch(err){
        return res.status(403).send("invalid token")
    }
})




module.exports = app;
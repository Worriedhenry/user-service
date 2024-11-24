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

app.put("/user/banuser/:userId/:adminId", async (req, res) => {
    const { userId, adminId } = req.params;
    try {
        const reasonOfban=req.body.reasonOfBan;

        const user = await UsersSchema.updateOne(
            { _id: userId },
            { $set: { banned: true, bannedByAdmin: adminId,reasonOfban:reasonOfban } }
        );
        return res.status(204).send("ok");
    }
    catch (err) {
        return res.status(403).send("invalid token");
    }
});

app.put("/user/removeban/:userId",async (req,res)=>{
    const {userId} =req.params;
    try{
        const user=await UsersSchema.updateOne(
            {_id:userId},
            {$set:{banned:false,reasonOfban:""}}
        )
        res.status(204).send("Ban Removed")
    }
    catch(err){
        return res.status(403).send("invalid token")
    }
})
app.get("/user/getbannedusers",async (req,res)=>{
    try{
        const bannedUsers=await UsersSchema.find({banned:true}).populate({
            path:"bannedByAdmin",
            select:"username",
            model:"Users"
        })
        res.status(200).send(bannedUsers)
    }
    catch(err){
        console.log(err)
        return res.status(403).send("invalid token")
    }
})
app.get("/user/geteditors",async (req,res)=>{
    try{
        const editors=await UsersSchema.find({role:"editor"})
        res.status(200).send(editors)
    }
    catch(err){
        return res.status(403).send("invalid token")
    }
})

app.put("/user/removeeditor/:editorId",async (req,res)=>{
    const {editorId}=req.params;
    try{
        const editor=await UsersSchema.updateOne(
            {_id:editorId},
            {$set:{role:"user"}}
        )
        res.status(204).send("Editor Removed")
    }
    catch(err){
        return res.status(403).send("invalid token")
    }
})

app.put("/user/addeditor/:username",async (req,res)=>{
    const {username}=req.params;
    try{
        console.log(username)
        const user=await UsersSchema.findOne({username});
        if(!user || user.role!="user"){
            return res.status(200).send("User not found")
        }
        const editor=await UsersSchema.updateOne(
            {_id:user._id},
            {$set:{role:"editor"}}
        )
        res.status(204).send("Editor Added")
    }
    catch(err){
        console.log(err);
        return res.status(403).send("invalid token")
    }
})

app.get('/user/getprofile/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const user = await Users.findById(userId, {username:1,email:1,fullname:1,about: 1, location: 1, profilePic: 1, services: 1, profileTags: 1, avgRating: 1, education: 1, achievements: 1, email: 1,createdAt: 1 ,avgResponseTime:1,skills:1,role:1,banned:1,reasonOfban:1})

        if (!user) {
            return res.status(404).json({ msg: "user not found" })
        }

        const createdAtDate = user.createdAt;
        const month = createdAtDate.getMonth() + 1; 
        const year = createdAtDate.getFullYear();


        return res.send({user,createdAtMonth:month,createdAtYear:year})
    } catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
})
app.get("/user/getcontact/:id", async (req, res) => {
    const id = req.params.id
    try {
        const user = await Users.findById(id, {
            phone: 1,
            socials: 1,
            personalSite: 1,
            payment: 1,
            location: 1,
            email: 1
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Extracting month and year from createdAt
        

        return res.send(user);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }

})

app.get("/user/getworkhistory/:id", async (req, res) => {
    const id = req.params.id
    try {
        const user = await Users.findById(id, {
            workHistory: 1,
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        return res.send(user)
    }

    catch (err) {
        console.log(err);
        res.send(500).send(err);
    }
})

module.exports = app;

var ObjectID  = require('mongodb').ObjectID;

class Conversation {
    constructor(participants){
        this._convId = new ObjectID().toHexString()
        this._createdAt = Date.now()
        this._creatorId = participants[0]
        this._participants = participants
    }

    get convId(){
        return this._convId
    }

    get createdAt(){
        return this._createdAt
    }
    get creatorId(){
        return this._creatorId 
    }
    get participants(){
        return this._participants
    }
    set convId(x){
        this._convId = x
    }
    set createdAt(x){
        this._createdAt = x
    }
    set creatorId(x){
        this._creatorId = x 
    }
    set participants(x){
        this._participants = x
    }
    addParticipant(x){
        this._participants.push(x)
    }
    json(){
        return {
            convId :this._convId,
            createdAt : this._createdAt,
            creatorId : this._creatorId,
            _participants : this._participants 
        }
    }
} 

module.exports = Conversation
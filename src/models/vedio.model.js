import mongoose , {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const vedioSchema = new Schema({
   
    vediofile:{
        type : String, 
        required : true,
    },
    thumbnail:{
        type : String, 
        required : true,
    },
    title:{
        type : String, 
        required : true,
    },
    description:{
        type : String, 
        required : true,
    },
    duration:{
        type : Number, 
        required : true,
    },
    views: {
        type : Number, 
        reuired : true,

    },
    isPublished:{
        type : Boolean, 
        required : true,
    },
    owner : {
        type: Schema.Types.ObjectId,
        ref : "user",
    }



},
 {
    timestamps: true,
 }
 
 
)
vedioSchema.plugin(mongooseAggregatePaginate)

export const vedio = mongoose.model("vedio" , vedioSchema)
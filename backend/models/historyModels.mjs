import mongoose from 'mongoose';

const standardDataSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
      },
      minLength: {
        type: Number,
        required: true,
      },
      maxLength: {
        type: Number,
        required: true,
      },
      shape: {
        type: [String],
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      conditionMin: {
        type: String,
        enum: ['GE', 'LE', 'GT', 'LT', 'EQ', 'NE'],
        required: true,
      },
      conditionMax: {
        type: String,
        enum: ['GE', 'LE', 'GT', 'LT', 'EQ', 'NE'],
        required: true,
      },
      value: {
        type: Number,
      },
},{_id:false});


const historyModelSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
    },
    createDate:{
        type :Date,
        default: Date.now,
    },
    imageLink:{
        type:String,
    },
    inspectionID:{
        type:String,
        required:true,
    },
    standardID:{
        type:String,
        required:true,
    },
    note:{
        type:String,
    },
    standardName:{
        type:String,
        required:true,
    },
    samplingDate:{
        type:Date,
        required:true,
    },
    samplingPoint:{
        type:[String],
        required:true,
    },
    price:{
        type:Number,
        min:0,
    },
    standardData:{
        type:[standardDataSchema],
        required:true,
    },
})

export default mongoose.model("history",historyModelSchema);


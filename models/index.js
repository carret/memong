var index = {
    username : {
        type: String,
        required: true
    },
    word : {
        type: String,
        required: true
    },
    memos : [
        {
            memo : {
                memoId : {
                    type:String,
                    required:true
                },
                title: {
                    type:String,
                    required:true
                },
                summary:{
                    type:String,
                    required:true
                },
                weight : {
                    type:Number,
                    required:true
                }
            },
        }
    ]
};

module.exports = index;
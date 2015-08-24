var index = {
    username : {
        Type:String,
        required:true
    },
    word : {
        Type:String,
        required:true
    },
    memos : [
        {
            memoId : {
                title: {
                    Type:String,
                    required:true
                },
                summary:{
                    Type:String,
                    required:true
                }
            }
        }
    ]
}

module.exports = index;
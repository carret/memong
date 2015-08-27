var Index = {
    username : {
        type:String
    },
    word : {
        type:String
    },
    memos : [
        {
            memo : {
                memoId : {
                    type:String
                },
                title: {
                    type:String
                },
                summary:{
                    type:String
                },
                weight : {
                    type:Number
                }
            },
        }
    ]
}

module.exports = Index;
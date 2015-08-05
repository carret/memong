var trash = {
    MemoStroe: {
        addMemo: function(_surplus, _newCompleteMemo, _targetEditingMemo) {
            //EditingMemo에서 (# + space)가 2개 이상 있을 때 호출. 메모를 추가합니다.
            var index = _indexOf(_memos, _targetEditingMemo.id, "id");

            _memos.splice(index, 0, _newCompleteMemo); //새로운 CompleteMemo를 추가합니다.
            _memos[index - 1].value += _surplus; //바로 앞의 메모에 잉여 내용들 추가합니다.

            _memos[index + 1] = _.extend({}, _memos[index + 1], _targetEditingMemo); //EditingMemo의 내용을 업데이트 합니다.

            console.log(_memos);
        },

        completeEditingMemo: function(_surplus, _targetEditingMemo) {
            var isLastEditingMemo = (_targetEditingMemo.type == MemoTypeConstants.LAST_EDITING_MEMO) ? true : false;

            //EditingMemo에서 Focus가 풀렸을 때 호출. 메모를 편집합니다.
            var index = _indexOf(_memos, _targetEditingMemo.id, "id");
            _memos[index - 1].value += _surplus; //남아 있는 잉여 내용들 바로 앞의 메모에 추가합니다.


            if (typeof _targetEditingMemo.value == "undefined"){
                //메모가 없어졌을 때, 해당 편집하던 메모를 삭제합니다.
                _memos.splice(index, 1);
            }
            else {
                //메모의 내용이 편집된 경우
                //EditingMemo를 CompleteMemo로 업데이트 합니다
                _targetEditingMemo.type = MemoTypeConstants.COMPLETE_MEMO;
                _memos[index] = _.extend({}, _memos[index], _targetEditingMemo);
            }

            if (isLastEditingMemo) {
                _memos.push(last_editing_memo);
            }
        },

        startEditingMemo: function(_targetCompleteMemo) {
            //EditingMemo를 클릭했을 때 호출. CompleteMemo를 EditingMemo로 바꿉니다.
            var index = _indexOf(_memos, _targetCompleteMemo.id, "id");
            _targetCompleteMemo.type = MemoTypeConstants.EDITING_MEMO;
            _memos[index] = _.extend({}, _memos[index], _targetCompleteMemo);
        }

    }
};





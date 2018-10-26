todoapp.controller("todoController", ["$scope", "$document", "$localStorage", "$uibModal", function($scope, $document, $localStorage, $uibModal){

    $scope.listItems = [];
    $scope.init = function(){
        temp = $localStorage.storedValues;
        if(typeof temp === 'object' && temp != null && temp.length > 0){
            $scope.listItems = temp;
        }
    }
    $scope.init();

    $scope.createTodoList = function(){
        if($scope.newListItemName != undefined){
            $scope.listItemData = {};
            $scope.listItemData.name = $scope.newListItemName;
            $scope.listItems.push($scope.listItemData);
            $scope.newListItemName = undefined;
        }
        $localStorage.storedValues = $scope.listItems;
    }

    $scope.openItemEditor = function(itemValues, arrayIndex){
        var modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: "modal-title",
            ariaDescribedBy: "modal-body",
            templateUrl: "editListItemTemplate.html",
            controller: "editItemController",
            controllerAs: "$ctrl",
            resolve: {
                editColumnData: function() {
                    data = {
                        "itemValues": itemValues,
                        "arrayIndex": arrayIndex
                    }
                    return data;
                }
            }
        });
        modalInstance.result.then(function(res) {
           var theNewIndexVal = res.order - 1;
           var theOldIndexVal = res.oldArrayPos;
           var cutOut = $scope.listItems.splice(theOldIndexVal, 1) [0]; // cut the element at index 'from'
           $scope.listItems.splice(theNewIndexVal, 0, cutOut);      
        });
    }

    $scope.deleteItemList = function(itemData, pos){
        temListArray = $scope.listItems;
        temListArray.splice(pos, 1);
    }

}]);

todoapp.controller("editItemController", function($uibModalInstance, editColumnData) {
    var $ctrl = this;
    $ctrl.itemData = editColumnData.itemValues; 
    $ctrl.itemData.oldArrayPos = editColumnData.arrayIndex;
    $ctrl.cancelUserSub = function() {
        $uibModalInstance.close($ctrl.itemData);
    };
});
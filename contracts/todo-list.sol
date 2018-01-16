pragma solidity ^0.4.18;

contract List {
    bytes16[] public groceriesList;

    function addItem(bytes16 _item) public {
        groceriesList.push(_item);
        ListUpdated(groceriesList);
    }

    function getList() public view returns (bytes16[]) {
        return groceriesList;
    }

    event ListUpdated(bytes16[] groceriesList);
}
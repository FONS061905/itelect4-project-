export var ItemStatus;
(function (ItemStatus) {
    ItemStatus["Reported"] = "reported";
    ItemStatus["Claimed"] = "claimed";
    ItemStatus["Verified"] = "verified";
    ItemStatus["Returned"] = "returned";
})(ItemStatus || (ItemStatus = {}));
export var ClaimStatus;
(function (ClaimStatus) {
    ClaimStatus["Pending"] = "pending";
    ClaimStatus["Approved"] = "approved";
    ClaimStatus["Rejected"] = "rejected";
})(ClaimStatus || (ClaimStatus = {}));

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const boothName = params.get("boothName");
  const tableName = params.get("tableName");
  const totalPrice = params.get("totalPrice");
  const paymentMethod = params.get("paymentMethod");

  document.getElementById("booth-name").textContent = boothName || "";
  document.getElementById("table-name").textContent = tableName || "";
  document.getElementById("total-price").textContent = totalPrice || "";
  document.getElementById("payment-method").textContent = paymentMethod || "";

  loadBoothData();
});

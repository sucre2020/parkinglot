document.addEventListener("DOMContentLoaded", function () {
  const arrivalTimes = [
    { vehicle: "Rayfield - Kwang", amount: "#200:00" },
    { vehicle: "Bukuru - Gada Biu", amount: "#200:00" },
    { vehicle: "Old Airport - Terminus", amount: "#200:00" },
    { vehicle: "New Juth - British", amount: "#200:00" },
    { vehicle: "Dadin Kowa - Secretariat", amount: "#200:00" },
  ];

  const arrivalTimesList = document.getElementById("arrival-times-list");
  arrivalTimes.forEach((boarded) => {
    const li = document.createElement("li");
    li.textContent = `${boarded.vehicle} - Price: ${boarded.amount}`;
    arrivalTimesList.appendChild(li);
  });
});

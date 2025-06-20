// 🌐 Home Page: Search & Redirect
if (document.getElementById("searchBtn")) {
  document.getElementById("searchBtn").addEventListener("click", () => {
    const dishName = document.getElementById("dishInput").value.trim();

    if (dishName === "") {
      document.getElementById("error").textContent = "Please enter a dish name.";
    } else {
      document.getElementById("error").textContent = "";
      window.location.href = `result.html?dish=${encodeURIComponent(dishName)}`;
    }
  });
}

// 📄 Result Page: Load dish details
if (window.location.pathname.includes("result.html")) {
  const urlParams = new URLSearchParams(window.location.search);
  const dishName = urlParams.get("dish");

  // Show dish name in header
  if (document.getElementById("dishTitle")) {
    document.getElementById("dishTitle").textContent = dishName;
  }

  // 🌀 Show loader
  if (document.getElementById("loader")) {
    document.getElementById("loader").style.display = "block";
  }

  // 🌍 Wikipedia API
  fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${dishName}`)
    .then(res => res.json())
    .then(data => {
      if (data.type === "https://mediawiki.org/wiki/HyperSwitch/errors/not_found") {
        document.getElementById("dishDescription").textContent = "❌ Dish not found on Wikipedia.";
        document.getElementById("dishImage").style.display = "none";
        document.getElementById("dishOrigin").textContent = "Unknown";
      } else {
        document.getElementById("dishDescription").textContent = data.extract || "No description found.";

        if (data.thumbnail?.source) {
          document.getElementById("dishImage").src = data.thumbnail.source;
          document.getElementById("dishImage").alt = dishName;
        } else {
          document.getElementById("dishImage").style.display = "none";
        }

        document.getElementById("dishOrigin").textContent = data.description || "Unknown";
      }

      // ✅ Hide loader after Wikipedia
      if (document.getElementById("loader")) {
        document.getElementById("loader").style.display = "none";
      }
    })
    .catch(err => {
      console.error("Error fetching Wikipedia:", err);
      document.getElementById("dishDescription").textContent = "❌ Failed to load dish info.";
      if (document.getElementById("loader")) {
        document.getElementById("loader").style.display = "none";
      }
    });

  // 📦 Nutrition + YouTube from JSON
  fetch("data/sample-dishes.json")
    .then(res => res.json())
    .then(jsonData => {
      const dishData = jsonData.find(
        d => d.name.toLowerCase() === dishName.toLowerCase()
      );

      if (dishData) {
        document.getElementById("calories").textContent = dishData.nutrition.calories;
        document.getElementById("protein").textContent = dishData.nutrition.protein;
        document.getElementById("fat").textContent = dishData.nutrition.fat;

        document.getElementById("dishTitleInline").textContent = dishData.name;

        const searchQuery = `${dishName} recipe`;
        document.getElementById("videoFrame").src = `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(searchQuery)}`;
      } else {
        document.getElementById("nutritionSection").innerHTML = "<p>❌ Nutrition info not available.</p>";
        document.getElementById("videoSection").innerHTML = "<p>❌ Video not available.</p>";
      }
    })
    .catch(err => {
      console.log("Nutrition or video fetch failed:", err);
    });

  // ❤️ Save to Favorites
  if (document.getElementById("saveFavBtn")) {
    document.getElementById("saveFavBtn").addEventListener("click", () => {
      let favs = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!favs.includes(dishName)) {
        favs.push(dishName);
        localStorage.setItem("favorites", JSON.stringify(favs));
        alert(`✅ ${dishName} added to favorites!`);
      } else {
        alert("✅ Already in favorites!");
      }
    });
  }
}

// ❌ Remove Favorite from localStorage
function removeFav(name) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  favs = favs.filter(d => d !== name);
  localStorage.setItem("favorites", JSON.stringify(favs));
  location.reload();
}

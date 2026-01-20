const API_KEY = "4acbee9c2aed5820fc592ace99f01629";
const WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather";
const WIKI_URL = "https://en.wikipedia.org/api/rest_v1/page/summary";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("cityInput");
  const btn = document.getElementById("getInfo");
  const out = document.getElementById("output");

  btn.addEventListener("click", getCityInfo);
  input.addEventListener("keypress", (e) => e.key === "Enter" && getCityInfo());

  async function getCityInfo() {
    const city = input.value.trim();
    if (!city)
      return (out.className = "error"), (out.textContent = "No city match");

    try {
      const [wiki, weather] = await Promise.all([
        fetch(`${WIKI_URL}/${city}`).then((r) => r.json()),
        fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`).then(
          (r) => r.json()
        ),
      ]);

      if (!wiki?.extract || weather.cod !== 200)
        throw new Error(weather.message || "No data found");

      const content = `${
        wiki.extract
      }\nThe current temperature in ${city} is ${weather.main.temp.toFixed(
        2
      )} degrees Celsius.`;

      out.className = "success";
      out.innerHTML = `<strong>${city}.txt</strong><br>${content}`;
      download(city, content);
    } catch (e) {
      out.className = "error";
      out.textContent = `${e.message}`;
    }
  }

  function download(city, content) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content]));
    a.download = `${city}.txt`;
    a.click();
  }
});

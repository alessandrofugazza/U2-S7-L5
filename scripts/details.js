const serverUrl = "https://striveschool-api.herokuapp.com/api/product/";
const apiValue =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGU4ODI5ZDY4NWVjNDAwMTQ1MGJjZDciLCJpYXQiOjE2OTI5NTkzODksImV4cCI6MTY5NDE2ODk4OX0.ohesj5ZWa_LS-OtWXZfPBdjC17b5SUhJi4ge_gwaKZk";

window.onload = async () => {
  const productId = new URLSearchParams(window.location.search).get("productId");
  const re = await fetch(serverUrl + "/" + productId, {
    method: "GET",
    headers: {
      Authorization: apiValue,
    },
  });
  if (!re.ok) {
    throw new Error("error");
  }
  const product = await re.json();
  const mainContainer = document.querySelector("main");
  const productContainer = document.createElement("article");
  const title = document.createElement("h2");
  title.className = "mb-4";
  title.innerText = product.name;
  productContainer.appendChild(title);
  const img = document.createElement("img");
  img.src = product.imageUrl;
  img.className = "img-fluid mb-4 detail-page-img";
  productContainer.appendChild(img);
  const description = document.createElement("p");
  description.innerHTML = `<span class='fw-bold'>Product description: </span>${product.description}`;
  productContainer.appendChild(description);
  const brand = document.createElement("p");
  brand.innerHTML = `<span class='fw-bold'>Product brand: </span>${product.brand}`;
  productContainer.appendChild(brand);
  const price = document.createElement("p");
  price.innerHTML = `<span class='fw-bold'>Price: </span>$${product.price}`;
  productContainer.appendChild(price);
  mainContainer.appendChild(productContainer);
};

const query = `
  {
    products(first: 10) {
      edges {
        node {
          title
          description
          variants(first: 1) {
            edges {
              node {
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
          images(first: 2) {
            edges {
              node {
                url
                altText
              }
            }
          }
        }
      }
    }
  }
`;

const fetchProducts = async () => {
   const response = await fetch('https://tsodykteststore.myshopify.com/api/2023-01/graphql.json', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         'X-Shopify-Storefront-Access-Token': '7e174585a317d187255660745da44cc7'
      },
      body: JSON.stringify({ query })
   });

   const data = await response.json();
   displayProducts(data);
   console.log(data)
};

const displayProducts = (data) => {
   const productsContainer = document.getElementById('product-container')


   data.data.products.edges.forEach((productEdge) => {
      const product = productEdge.node;
      const productTitle = product.title;
      const productDescr = product.description;
      const productPrice = product.variants.edges[0].node.price.amount
      const productCompareAtPrice = product.variants.edges[0].node.compareAtPrice.amount
      const productImage = product.images.edges.length > 0 ? product.images.edges[0].node : '';

      const productHtml = `
      <div class="product">
        <img class="product__image" src="${productImage.url}" alt="${productImage.altText}" />
        <div>
        <h2 class="product__title">${productTitle }</h2>
        <p class="product__descr">${productDescr ? productDescr : "Lorem ipsum dolor sit amet"}</p>
        <p class="product__price"> <span class='compare-price'>${productCompareAtPrice}</span> ${productPrice}</p>
        </div>
      </div>
      `

      productsContainer.innerHTML += productHtml;

   });

   const productImages = document.querySelectorAll('.product__image');

   productImages.forEach((image, index) => {
      const product = data.data.products.edges[index].node;
      const defaultImage = product.images.edges.length > 0 ? product.images.edges[0].node : '';
      const hoverImage = product.images.edges.length > 1 ? product.images.edges[1].node : defaultImage;

      
      image.addEventListener('mouseenter', () => {
         image.src = hoverImage.url; 
         image.classList.add('showImage')
         image.classList.remove('hideImage')

      });

      image.addEventListener('mouseleave', () => {
         image.src = defaultImage.url; 
         image.classList.remove('showImage')
         image.classList.add('hideImage')
      });
   });
};

fetchProducts();

const buttons = document.querySelectorAll('.btn-wrapp__btn');
const answerTexts = document.querySelectorAll('.answer');
const lines = document.querySelectorAll('.line2');
const questionCards = document.querySelectorAll('.question');

buttons.forEach((button, index) => {
   button.addEventListener("click", () => {
      const currentAnswerText = answerTexts[index];
      const currentQuestionCard = questionCards[index];
      const currentLine = lines[index];

      if (currentAnswerText.classList.contains('textAnimOpen')) {
         currentQuestionCard.classList.remove('backAnim');
         currentAnswerText.classList.remove('textAnimOpen');
         currentAnswerText.classList.add('textAnimHide');

         currentLine.classList.remove('lineOpen');
         currentLine.classList.add('lineClose');

         currentAnswerText.classList.remove('active');
      } else {
         answerTexts.forEach((text, i) => {
            text.classList.add('textAnimHide');
            text.classList.remove('textAnimOpen');
            lines[i].classList.remove('lineOpen');
            lines[i].classList.add('lineClose');
            questionCards[i].classList.remove('backAnim');
            text.classList.remove('active');
         });

         currentAnswerText.classList.remove('textAnimHide');
         currentAnswerText.classList.add('textAnimOpen');

         currentLine.classList.remove('lineClose');
         currentLine.classList.add('lineOpen');

         currentQuestionCard.classList.add('backAnim');
      }
   });
});

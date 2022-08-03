const sendHttpRequest = () => {

  const username = $('form.contactForm input[name="name"]').val();
  const http = new XMLHttpRequest();
  http.responseType = 'json';
  http.open('GET', `http://felix-windows:3010/behance?user=${username}`, true);
  http.send();

  http.onreadystatechange = () => {
    if (http.readyState === 4 && http.status === 200) {
      console.log(http);
      renderProjectsCategory(http.response.categories);
      renderProjectsCards(http.response.projects);
    }
  }
}

const renderProjectsCategory = (categories) => {
  try {

    $('#portfolio-flters li').not(":first-child").remove();

    const mainDiv = document.getElementById('portfolio-flters');

    categories.map((category, indiceClassName) => {
      const li = document.createElement('li');
      li.setAttribute("data-filter", `.${category.indice}`);
      li.innerHTML = `${category.value}`;
      mainDiv.appendChild(li);
    })
  } catch (error) {
    console.log(error);
  }
}

const renderProjectsCards = (projects) => {

  try {

    const mainDiv = document.getElementsByClassName('portfolio-container');
    $(mainDiv).empty();

    projects.map((project, index) => {

      const categories = project.categories.map(el => el.indice).join(' ');

      const html = `<div class="col-lg-4 col-md-6 portfolio-item wow fadeInUp ${categories}">
            <div class="portfolio-wrap">
              <figure>
                <img src="${project.covers.original}" class="img-fluid" alt="${project.slug}">
                <a href="${project.covers.original}" data-lightbox="portfolio" data-title="${project.name}" class="link-preview"
                  title="Preview"><i class="ion ion-eye"></i>
                  </a>
                <a href="#" class="link-details" title="More Details"><i class="ion ion-android-open"></i></a>
              </figure>

              <div class="portfolio-info">
                <h4><a href="#">${project.name}</a></h4>
                <p>App</p>
              </div>
            </div>
          </div>`;

      $(mainDiv).append(html);
    })

    activePortifolioContainer();

  } catch (error) {
    console.log(error)
  }
}

const activePortifolioContainer = () => {

  const mainDiv = document.getElementsByClassName('portfolio-container');

  $("section#portfolio").show();

  const layoutsMode = ["fitRows", "masonry"];

  var portfolioIsotope = $('.portfolio-container').isotope({
    itemSelector: '.portfolio-item',
    layoutMode: layoutsMode[Math.floor(Math.random() * layoutsMode.length)],
    percentPosition: true,
  });

  $('#portfolio-flters li').on('click', function () {
    $("#portfolio-flters li").removeClass('filter-active');
    $(this).addClass('filter-active');
    portfolioIsotope.isotope({ filter: $(this).data('filter') });
  });

  if ($(mainDiv).css('height') == '0px') {
    $(mainDiv).css("height", "100%");
  }
}
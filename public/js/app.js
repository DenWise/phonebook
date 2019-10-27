
function preventSymbolsInput(e,symbols) {
    let regex = new RegExp(symbols,"i");
    console.log(regex);
    if (regex.test(e.key)) {
        e.preventDefault();
    }
}

const App = {
  init: function() {
      this.noticePopup = $('#notice');
      this.layout = $('#popup-layout');
      this.popup = $('.popup');
      this.popupTitle = $('.popup-title');
      this.popupButton = $('.popup-button');
      this.inputName = $('#name-input');
      this.inputNumber = $('#number-input');
      this.inputs = $('.popup input');
      this.url = $('#form-url');

      this.showContacts();
  },
  showContacts: function(page) {
      let url = page ? '/list/' + page: '/list';
      this.ajaxRequest(url,'GET', [], this.printList);
  },
  printList: function(data) {
      const ul = $('.list');
      ul.html('');
      $.each(data['contacts'],function (index, el) {
          let newRow = '<li data-id="'+index+'" class="contact-item">\n' +
              '            <span class="delete-btn"><i class="far fa-trash-alt"></i>\n' +
              '            </span><span class="name">'+el.name+'</span>\n' +
              '            <span class="number">'+el.phone+'</span>\n' +
              '        </li>';

          ul.append(newRow);
      });
      App.setPagination(data['pagination']);
  },
  setPagination: function(pagination) {
      console.log(pagination);
    let showArrows = pagination.totalPages > 3,
        pageBlock = $('.pagination');
        pageBlock.html('');

    for (i = 1; i <= pagination.totalPages; i++) {
        if (i === 1 && showArrows && pagination.previousPage) {
            pageBlock.append('<div class="arrow left-arrow" data-page="'+pagination.previousPage+'"><i class="fas fa-chevron-left"></i></div>');
        }
        if (i === pagination.currentPage) {
            pageBlock.append('<div class="pagination-item current-page" data-page="'+i+'">'+pagination.currentPage+'</div>');
        } else {
            let pageNode = document.createElement('div');
            pageNode.dataset.page = i;
            pageNode.classList.add('pagination-item');
            pageNode.innerHTML = i;
            if (pagination.nextPage !== null && i > pagination.nextPage+1) pageNode.classList.add('hide');
            pageBlock.append(pageNode);
        }
        if (i === pagination.totalPages && showArrows && pagination.nextPage) {
            pageBlock.append('<div class="arrow right-arrow" data-page="'+pagination.nextPage+'"><i class="fas fa-chevron-right"></i></div>');
        }
    }
  },
  ajaxRequest: function (url,method,data,success) {
      $.ajax({
          type: method,
          url: url,
          data: JSON.stringify(data),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
          success: function(data, textStatus, xhr){
              success(data,xhr);
          },
          error: function(jqXHR, textStatus, errorThrown) {
              this.showNoticePopup('Ошибка. Попробуйте позже.');
              console.log('jqXHR:');
              console.log(jqXHR);
              console.log('textStatus:');
              console.log(textStatus);
              console.log('errorThrown:');
              console.log(errorThrown);
          }
      });
  },
  showNoticePopup: function (message) {
      this.noticePopup.html('<p class="notice">'+message+'</p>');
      this.noticePopup.fadeIn(300);
      this.layout.fadeIn(50);
  },
  hideNoticePopup: function() {
      this.noticePopup.fadeOut(300);
      this.layout.fadeOut(300);
  },
  showPopup: function(action,title,button,name,number) {
      this.popupTitle.html(title);
      this.popupButton.html(button);
      this.url.val(action);
      if (name && number) {
          this.inputName.val(name);
          this.inputNumber.val(number);
      }
      this.popup.show();
      this.layout.show();
  },
  hidePopup: function () {
      this.popup.hide();
      this.layout.hide();
      this.popupTitle.html();
      this.popupButton.html();
      this.inputs.each(function (index,el) {
          el.value = '';
      })
  }
};

$(document).ready(function(){

    App.init();

    $('.plus').on('click',function (ev) {
        App.showPopup('/contact', 'New contact', 'Add');
    });

    App.layout.on('click', function () {
       App.hidePopup();
       App.hideNoticePopup();
    });

    $('ul').on("click", ".delete-btn", function(event) {
        let id = $(this).closest('li').data('id');
        event.stopPropagation();

        App.ajaxRequest('/contact/'+id,'DELETE', [], (function(data, xhr) {
            if (xhr.status == 200) {
                $(this).parent().slideUp(700, function() {
                    $(this).remove();
                });
            } else {
                App.showNoticePopup('Something went wrong while deleting the contact');
                setTimeout(function () {
                    App.hideNoticePopup();
                },2000);
            }
        }).bind(this));


    });

    $('ul').on("click", "li.contact-item", function(event) {
        let id = $(this).data('id');
        App.ajaxRequest('/contact/'+id,'GET', [], function(data) {
            App.showPopup('/contact/'+id, 'Edit contact', 'Save', data.name,data.phone);
        });
    });

    $(document).on('click','.pagination-item', function (ev) {
        let page = $(this).data('page');
        App.showContacts(page);
    });

    $(document).on('click','.arrow', function (ev) {
        let page = $(this).data('page');
        App.showContacts(page);
    });

    $("input#name-input").keypress(function(e) {
        preventSymbolsInput(e,'[^a-zA-Zа-яА-Я--]');
    });

    $("input#number-input").keypress(function(e) {
        preventSymbolsInput(e,"[^0-9\(\)--]");
    });

});
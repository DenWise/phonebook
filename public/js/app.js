
function preventSymbolsInput(e,symbols) {
    let regex = new RegExp(symbols,"i");
    if (regex.test(e.key)) {
        e.preventDefault();
    }
}

const App = {
  init: function() {
      this.noticePopup = $('.popup#notice');
      this.layout = $('#popup-layout');
      this.formPopup = $('.popup#form');
      this.popupTitle = $('.popup-title');
      this.popupButton = $('.popup-button');
      this.inputName = $('#name-input');
      this.inputNumber = $('#phone-input');
      this.inputs = $('.popup input');
      this.url = $('#form-url');

      this.showContacts('list', '/list');
  },
  submitForm: function(url, name, phone) {
    this.ajaxRequest(url,"POST",{'name': name, 'phone': phone}, function(data){
        App.showNoticePopup(data.message);
        App.showContacts('list', '/list');
    });
  },
  showContacts: function(type, url, page) {
      let container = $('#container');
      container.data("pagination_url", url);
      container.data("state", type);
      let separator = type === 'list' ? '/' : type === 'search' ? '&page=': '/';
      url = page ? url + separator + page: url;
      this.ajaxRequest(url,'GET', [], this.printList);
  },
  printList: function(data,xhr) {
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
              App.showNoticePopup('Ошибка. Попробуйте позже.');
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
      this.hidePopup();
      this.noticePopup.html('<p class="notice">'+message+'</p>');
      this.noticePopup.fadeIn(300);
      this.layout.fadeIn(300);
      setTimeout(this.hideNoticePopup,2000);
  },
  hideNoticePopup: function() {
      App.noticePopup.fadeOut(300);
      App.layout.fadeOut(300);
  },
  showPopup: function(action,title,button,name,phone) {
      this.popupTitle.html(title);
      this.popupButton.html(button);
      this.url.val(action);
      if (name && phone) {
          this.inputName.val(name);
          this.inputNumber.val(phone);
      }
      this.formPopup.show();
      this.layout.show();
  },
  hidePopup: function () {
      this.formPopup.hide();
      this.layout.hide();
      this.popupTitle.html();
      this.popupButton.html();
      this.inputs.each(function (index,el) {
          el.value = '';
          $(el).removeClass('error');
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
        let state = $('#container').data('state');
        let url = $('#container').data('pagination_url');
        App.showContacts(state,url,page);
    });

    $(document).on('click','.arrow', function (ev) {
        let page = $(this).data('page');
        let state = $('#container').data('state');
        let url = $('#container').data('pagination_url');
        App.showContacts(state,url,page);
    });

    $("input#name-input").keypress(function(e) {
        preventSymbolsInput(e,'[^a-zA-Zа-яА-Я--\s]');
    });

    $("input#phone-input").keypress(function(e) {
        preventSymbolsInput(e,"[^0-9\(\)--]");
    });

    $(document).on('click', '.popup input', function(ev){
        $(this).removeClass('error');
    });

    $(document).on('click', '.popup-button', function(ev){
        let popup = $('.popup'),
            url = popup.find('#form-url').val() || null,
            nameValue = popup.find('#name-input').val() || null,
            phoneValue = popup.find('#phone-input').val() || null;

        if (url && nameValue && phoneValue) {
            App.submitForm(url,nameValue,phoneValue);
        } else {
            if (!nameValue) {
                popup.find('#name-input').addClass('error');
            }
            if (!phoneValue) {
                popup.find('#phone-input').addClass('error');
            }
        }
    })

    $('#searchInput').keypress(function(ev) {
        if (ev.which === 13) {
            let value = $(this).val(),
                url = $(this).data('url'),
                regExPhone = new RegExp(/[0-9]/i);

            if (value) {
                let type = regExPhone.test(value) ? 'number':'name';
                if (type) {
                    url = url + '?type=' + type + '&value=' + value;
                    App.showContacts('search',url);
                }
            } else {
                App.showContacts('list', '/list');
            }

        }
    });
});
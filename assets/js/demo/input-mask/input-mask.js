// credit card
var cleaveCreditCard = new Cleave('.input-credit-card', {
    creditCard: true
});

document.querySelector('.button-credit-card').addEventListener('click', (function() {
    alert(cleaveCreditCard.getRawValue());
}));

// phone
var cleavePhone = new Cleave('.input-phone', {
    phone: true,
    phoneRegionCode: 'US'
});

// date
var cleaveDate = new Cleave('.input-date', {
    date: true
});

// numeral
var cleaveNumeral = new Cleave('.input-numeral', {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand'
});

// custom
var cleaveCustom = new Cleave('.input-custom', {
    blocks: [3, 3, 3, 3],
    delimiter: '-',
});

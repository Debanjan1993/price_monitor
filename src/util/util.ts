enum Sites {
    amazon = '#priceblock_ourprice',
    flipkart = '._30jeq3',
    myntra = '.pdp-price',
    snapdeal = '.pdp-final-price',
    ajio = '.prod-sp'
}


const urlfilter = async (url: string): Promise<string> => {
    if (url.includes('amazon')) {
        return Sites.amazon;
    } else if (url.includes('flipkart')) {
        return Sites.flipkart;
    } else if (url.includes('myntra')) {
        return Sites.myntra;
    } else if (url.includes('snapdeal')) {
        return Sites.snapdeal;
    } else if (url.includes('ajio')) {
        return Sites.ajio;
    } else {
        return undefined;
    }
}

enum QueueNames {
    mailUser = 'Mail_User',
    checkPrice = 'Check_Price',
    confirmationMail = 'Confirmation_Mail'
}



export { urlfilter, QueueNames}
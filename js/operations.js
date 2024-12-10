console.log('Operations.js succesfully loaded');

import { getBuildingInfo, dropDownDisplay } from "../js/modules/utilities.js";

const operationSectionEle = document.getElementById(`operation-section`);
const operationSelectionEle = document.querySelector('#type-select');

function displayTemplateMail () {
    const textareaSectionEle = operationSectionEle.querySelector(`#textarea-template-display`);

    const selectedOption = operationSelectionEle.options[operationSelectionEle.selectedIndex];

    if(selectedOption.textContent === `Intervention` ) {
        textareaSectionEle.value = `Bonjour [Nom du destinataire],

Objet : Demande d’intervention - Référence : XXXXXXXXXXX

ACP XXXXXX, Adresse XXXXX

Je me permets de vous contacter afin de solliciter une intervention concernant le problème suivant :

[Détails de l'intervention à compléter par le responsable]

Nous vous serions reconnaissants d’organiser cette intervention dans les plus brefs délais.

Pour permettre l’accès à l’immeuble, nous vous prions de bien vouloir contacter [Nom de la personne de contact] au [GSM].

Nous restons bien entendu à votre disposition pour toute information complémentaire.

Je vous remercie par avance pour votre réactivité.

Veuillez également noter que toute facture relative à cette intervention doit être envoyée à l’adresse suivante : invoice@op.be.

Libellé de facturation :
Référence : XXXXX
ACP : XXXXXXX
BCE : XXXXXXX
C/O Office des Propriétaires
Rue Vilain XIIII 53-55
1000 Bruxelles

Dans l’attente de votre retour, je vous prie d’agréer, l’expression de mes salutations distinguées.
    `
        
    }
    // else if(selectedOption.textContent === `Entretien` ) {}
    else if(selectedOption.textContent === `Livraison` ) {
        textareaSectionEle.value = `Bonjour [Nom du destinataire],

Objet : Demande de livraison - Référence : XXXXXXXXXXX

ACP XXXXXX, Adresse XXXXX

Je me permets de vous contacter afin de solliciter une livraison pour le suivant :

[Détails de la livraison à compléter par le responsable]

Nous vous serions reconnaissants d’organiser cette livraison dans les plus brefs délais à l’adresse suivante :

[Adresse de livraison à compléter]

Pour permettre l’accès à l’immeuble, nous vous prions de bien vouloir contacter [Nom de la personne de contact] au [GSM].

Nous restons bien entendu à votre disposition pour toute information complémentaire.

Je vous remercie par avance pour votre réactivité.

Veuillez également noter que toute facture relative à cette intervention doit être envoyée à l’adresse suivante : invoice@op.be.

Libellé de facturation :
Référence : XXXXX
ACP : XXXXXXX
BCE : XXXXXXX
C/O Office des Propriétaires
Rue Vilain XIIII 53-55
1000 Bruxelles

Dans l’attente de votre retour, je vous prie d’agréer, l’expression de mes salutations distinguées.
        `
    }
    else if(selectedOption.textContent === `Devis` ) {
        textareaSectionEle.value = `Bonjour [Nom du destinataire],

Objet : Demande de devis- Référence : XXXXXXXXXXX

ACP XXXXXX, Adresse XXXXX

Je me permets de vous contacter afin de solliciter un devis pour le problème suivant :

[Détails de la demande de devis à compléter par le responsable]

Nous vous serions reconnaissants de bien vouloir nous faire parvenir le devis dans les plus brefs délais.

Afin de recevoir l'accès, vous pouvez contacter [Nom de la personne de contact] au [GSM].

Nous restons à votre disposition pour toute information complémentaire.

Je vous remercie par avance pour votre réactivité.

Dans l’attente de votre retour, je vous prie d’agréer, [Nom du destinataire], l’expression de mes salutations distinguées.
        `
    }
};

operationSelectionEle.addEventListener('change', displayTemplateMail);

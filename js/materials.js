export const materials = {

    screenerFailed: `
        <div style="max-width: 800px; margin: auto; text-align: center;">
            <p>Thank you for your interest in our study.</p>
            <p>Unfortunately, based on your responses, you are not eligible to continue.</p>
            <p>You may now close this window.</p>
        </div>
    `,

    finalImpression: `
        <div class="page-container">
            <div class="page-header">
                <h1>Final Impressions</h1>
                <p class="page-header__sub-title">Please read the following carefully</p>
            </div>
            <p><b>Please add or remove any final words that you feel describe this candidate.</b></p>
            <p><i>You must include at least two.</i></p>
            <div class="final-impression-wrapper">
                <div id="final-sorter" class="word-list"></div>
                <p id="final-cannot-add-notice" class="notice-text--error" style="display: none;">You cannot add an item already in the list.</p>
                <form id="final-descript-form" class="word-entry-form">
                    <input id="final-descript-input" type="text" class="text-input" placeholder="e.g. 'thoughtful'" autocomplete="off" onkeydown="return /[a-z\-]/i.test(event.key)">
                    <button id="final-descript-add" type="submit" class="jspsych-btn word-entry-form__add-btn">+</button>
                </form>
                <button id="final-submit" class="jspsych-btn" disabled>Submit</button>
            </div>
        </div>
    `,

}



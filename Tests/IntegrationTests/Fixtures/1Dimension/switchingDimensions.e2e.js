import {beforeEach, subSection, checkPropTypes} from './../../utils';
import {
    Page,
    DimensionSwitcher
} from './../../pageModel';
import {Selector} from 'testcafe';

/* global fixture:true */

fixture`Switching dimensions`
    .beforeEach(beforeEach)
    .afterEach(() => checkPropTypes());

test('Switching dimensions', async t => {
    subSection('Navigate to some inner page and switch dimension');
    const translatedPageName = 'Translated page';
    const otherPageName = 'Untranslated page';

    await Page.goToPage(translatedPageName);
    await DimensionSwitcher.switchSingleDimension('Latvian');
    await t.click('#neos-NodeVariantCreationDialog-CreateEmpty');
    await Page.waitForIframeLoading();
    await t
        .expect(await Page.getReduxState(state => state.cr.contentDimensions.active.language[0])).eql('lv', 'Dimension switched to Latvian')
        .expect(Page.treeNode.withText(otherPageName).exists).notOk('Untranslated node gone from the tree');

    subSection('Switch back to original dimension');
    await DimensionSwitcher.switchSingleDimension('English (US)');
    await Page.waitForIframeLoading();
    await t
        .expect(await Page.getReduxState(state => state.cr.contentDimensions.active.language[0])).eql('en_US', 'Dimension back to English')
        .expect(Page.treeNode.withText(otherPageName).exists).ok('Untranslated node back in the tree');
});

test('Grouping of dimensions', async t => {
    await t
        .click(DimensionSwitcher.dimensionSwitcher)
        .expect(Selector('div[class*="selectBox__groupHeader"]').withExactText('EU').exists).ok('Languages group exists');
});

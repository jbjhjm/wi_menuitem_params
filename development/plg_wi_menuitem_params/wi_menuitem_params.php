<?php
<%= phpbanner %>

use Joomla\CMS\Plugin\CMSPlugin;
use Joomla\CMS\Language\Text;
use Joomla\CMS\Factory;
use Joomla\CMS\Form;

class PlgContentWi_menuitem_params extends CMSPlugin {

	var $enabled = true;

	function onContentPrepareForm($form, $data) {

        $app = Factory::getApplication();
        $option = $app->input->get('option');
        $view = $app->input->get('view');

        switch($option) {

                case 'com_menus': {
                    if ($app->isAdmin()) {
                            Form::addFormPath(__DIR__ . '/forms');
                            $form->loadFile('item', false);
                    }
                    return true;
                }

        }

        return true;

    }

    function _getMenuItemParams_() {

        // copy into template or whereever you need to get the params

		$app = Factory::getApplication();
		$activeMenuItem = $app->getMenu()->getActive();
		if(!$activeMenuItem) $activeMenuItem = $app->getMenu()->getDefault();
        $my_custom_param = $activeMenuItem->params->get('my_custom_param','default value');

    }

}

?>

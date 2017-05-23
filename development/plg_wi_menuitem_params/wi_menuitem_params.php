<?php
<%= phpbanner %>

class plgContentWi_menuitem_params extends JPlugin {

    function onContentPrepareForm($form, $data) {

        $app = JFactory::getApplication();
        $option = $app->input->get('option');
        $view = $app->input->get('view');

        switch($option) {

                case 'com_menus': {
                    if ($app->isAdmin()) {
                            JForm::addFormPath(__DIR__ . '/forms');
                            $form->loadFile('item', false);
                    }
                    return true;
                }

        }

        return true;

    }

    function _getMenuItemParams_() {

        // copy into template or whereever you need to get the params

        $activeMenuItem = $app->getMenu()->getActive();
		if(!$activeMenuItem) $activeMenuItem = $app->getMenu()->getDefault();
        $my_custom_param = $activeMenuItem->params->get('my_custom_param','default value');

    }

}

?>

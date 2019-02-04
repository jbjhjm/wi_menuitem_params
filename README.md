# Wolf Interactive Menuitem Parameters Plugin for Joomla 3
This plugin enables you to add custom parameters to joomla menu items and access them anywhere you want, e.g. in a custom template.

# Building
Make sure [NodeJS](https://nodejs.org/en/download/) is installed, then download or clone the repository: 
`git clone https://github.com/jbjhjm/wi_menuitem_params.git`

Change to development directory and run `npm install`.

use `grunt build` to create a package for joomla installer at ../release.

# Installation
Use joomla installer to install. Change to plugin manager and enable wi_menuitem_params plugin.

# Usage
After installation, locate /plugins/content/wi_menuitem_params/forms/item.xml within your joomla installation.
The xml file already contains a few example fields. Refer to [https://docs.joomla.org/Standard_form_field_types](Joomla form field types) to see what's possible.
By adjusting the "label" property within the line `<fieldset name="params" label="WI Custom Params">` you can modify the title of the tab page which will be displayed when editing a menu item.

Adjust the following code to your needs to access the values anywhere in your code:
```php
$app = JFactory::GetApplication();
$activeMenuItem = $app->getMenu()->getActive();

// If a user accesses a page which has no menu item, `$activeMenuItem` will be false. 
// Fall back to default/home menuItem.
if(!$activeMenuItem) $activeMenuItem = $app->getMenu()->getDefault();
$my_custom_param = $activeMenuItem->params->get('my_custom_param','default value');
```


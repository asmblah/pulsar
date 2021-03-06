---
layout: page
title: Color
category: Form helpers
---

Generates a text input with the [spectrum colourpicker](https://bgrins.github.io/spectrum/).

<div class="pulsar-panel">This helper requires  <code>PulsarFormComponent</code> to be included in your javascript</div>

## Example usage

{% code_example form_helpers/color %}

<div class="pulsar-example form">
    <div class="form__group colorpicker js-colorpicker">
        <label for="color-1" class="control__label">Pick colour</label>
        <div class="controls">
            <div class="input-group">
                <span class="input-group-addon">#</span>
                <input id="color-1" type="text" class="form__control">
            </div>
        </div>
    </div>
</div>

## Options applied to parent wrapper

Option             | Type.  | Description
------------------ | ------ | ---------------------------------------------------------
append             | string | Text or markup to include after the input element
append_type        | string | Use only when appending a button. `button` is the only valid value
class              | string | A space separated list of class names
guidance           | string | Text to be displayed in a popover, adds a (?) icon after the input
guidance-container | string | Element to bind guidance popover scroll behaviour to (default `body`)
help               | string | Additional guidance information to be displayed next to the input
label              | string | Text for the `<label>` companion element
prepend            | string | Text or markup to include before the input element
prepend_type       | string | Use only when prepending a button. `button`is the only valid value
required           | bool   | Visually indicates that the field must be completed
show-label         | bool   | Control visibility of the `<label>` element without affecting layout (default: true)

## Options applied to input

Option.     | Type   | Description
----------- | ------ | ---------------------------------------------------------
autofocus   | bool   | Whether the field should have input focus on page load
disabled    | bool   | If true, prevents the input from being interacted with
form        | string | Specific one or more forms this label belongs to
id          | string | A unique identifier, if required
name        | string | The name of this control
placeholder | string | A short hint that describes the expected value
required    | bool   | Adds `required` and `aria-required="true"` attributes
value       | string | Specifies the value of the input
data-*      | string | Data attributes, eg: `'data-foo': 'bar'`

Any other options not listed here will be applied to the input.

## Disabled state

Add the `'disabled': true` option to disable the field on load. See the [disabling elements styleguide](styleguides/disabling_elements/) for more information about how to disable elements via javascript. Provide help text or information within the UI where possible to explain why elements are disabled.

{% code_example form_helpers/color-disabled %}

<div class="pulsar-example form">
    <div class="form__group colorpicker js-colorpicker">
        <label for="color-2" class="control__label">Pick colour</label>
        <div class="controls">
            <div class="input-group">
                <span class="input-group-addon">#</span>
                <input id="color-2" type="text" disabled value="" class="form__control">
            </div>
        </div>
    </div>
</div>

## Error state

{% raw %}
```twig
{{
    form.colour({
        'label': 'Pick a colour',
        'error': 'Something went wrong',
        ...
```
{% endraw %}

## Accessibility

To maintain compliance with WCAG 2.0 AA, a form element must have a related label element, the easiest way to achieve this is to always pass an `id` attribute to form helpers. Form helpers will automatically add `aria-describedby="guid-<random-number>"` to inputs and an `id` to help blocks and errors. Additionally, `aria-invalid="true"` will be added to inputs when an error is passed.

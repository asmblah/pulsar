'use strict';

var $ = require('jquery');

function FilterBarComponent(html) {
    this.$html = html;
    this.$container = this.$html.find('.filter-bar');
};

FilterBarComponent.prototype.init = function () {
    var component = this;

    // Create the filter add button
    createFilterListButton(component);

    // Hide the form elements
    hideFormControls(component);

    // Move save button
    moveFormActions(component);

    // Handlers
    showFilterBar(component);
    showAddFilterPopover(component);
    addFilter(component);
    removeFilter(component);
    clearAllFilters(component);
}

function showFilterBar (component) {
    component.$html.on('click', '[data-ui="show-filter-bar"]', function(e) {
        var $addFilterButton = component.$container.find('[data-ui="show-filter-list"]');

        e.preventDefault();

        // Show add button if hidden by clear
        $addFilterButton.removeClass('display--none');

        // Show filter bar
        component.$container.removeClass('display--none');
    });
}

function createFilterListButton (component) {
    var $formGroups = component.$container.find('.form__group'),
        $addFilterButton,
        $filterList = $('<ul class="filter-bar__list"></ul>'),
        $filterLabelsWrapper = $('<div class="filter-bar__labels"></div>'),
        $target;

    // Loop through form groups
    $formGroups.each(function() {
        $filterList.append('<li><a href="#" class="filter-bar__list-item" data-ui="filter-item" data-filter-id="'+ $(this).find('.form__control').attr('id') +'" data-filter-title="'+ $(this).find('.control__label').text() +'">'+ $(this).find('.control__label').text() +'</a></li>')
    });

    // Build up list and mark up for Add filter button
    $addFilterButton = $('<button class="btn filter-bar__add" role="button" data-ui="show-filter-list" data-toggle="popover" data-trigger="click" title="Filter by" data-html="true" data-container="body" data-placement="bottom" data-content=""><i class="icon-plus"></i></button>');
    $addFilterButton.attr('data-content', $filterList[0].outerHTML);

    // Append button and label wrapper
    $filterLabelsWrapper.appendTo(component.$container.find('fieldset'));
    $addFilterButton.appendTo($filterLabelsWrapper);

    // Initialize popover
    $addFilterButton.popover();

    // Prevent default on button
    component.$html.on('click', '[data-ui="show-filter-list"]', function(e) {
        e.preventDefault();
    });
}

function hideFormControls (component) {
    component.$container
        .find('.form__group')
        .addClass('display--none');
    component.$container
        .find('.form__actions')
        .addClass('display--none');
}

function moveFormActions (component) {
    var $formActions = component.$container.find('.form__actions'),
        $fieldset = component.$container.find('fieldset');

    $formActions.appendTo($fieldset);
    $formActions.addClass('display--none');
}

function showAddFilterPopover (component) {
    var filterTitle,
        filterId,
        select2Placeholder,
        $clickedFilterListItem,
        $formGroup,
        $filterLabel,
        $popoverControls,
        $popoverContent,
        $field,
        $select2,
        $addFilterButton = component.$container.find('[data-ui="show-filter-list"]');

    component.$html.on('click', '[data-ui="filter-item"]', function(e) {
        e.preventDefault();

        filterTitle = $(this).attr('data-filter-title');
        filterId = $(this).attr('data-filter-id');
        $field = component.$container.find('#' + filterId);

        // Hide the filter item in the list
        updateFilterList($addFilterButton, filterId, 'hide');

        // Add new filter label
        $filterLabel = $('<span class="label label--primary label--large" data-filter-id="'+ filterId +'">' + filterTitle + ' <span class="chosen-filter"></span></span>');
        $filterLabel.insertBefore($addFilterButton);

        // If checkbox, check it but no need to display it or move to popover
        if ($field[0].type == 'checkbox') {

            // Hide the filter list popover
            $addFilterButton.popover('hide');

            // Check the checkbox
            $field.prop('checked', true);

            // Add the remove button to the label
            filterId = $filterLabel.attr('data-filter-id');
            $filterLabel.append('<a data-ui="filter-cancel" class="btn remove-button" data-filter-id="'+ filterId +'"><i class="icon-remove-sign"></i></a>');

            // Add the label
            $filterLabel
                .removeClass('label--primary')
                .addClass('label--inverse');

            // Hide the filter list button if no links remaining
            filterListButtonVisibility(component);

            // Check if save button should be visible
            formActionsVisibility(component);

        } else {

            // Create content for the popover
            $popoverContent = $('<div class="added-popover-content"></div>');

            // Move the field into the popover content
            $formGroup = component.$container.find('#' + filterId).closest('.form__group');
            $formGroup.appendTo($popoverContent);
            $formGroup.addClass('form__group--flush');

            // Hide the control label
            $formGroup
                .removeClass('display--none')
                .find('.control__label')
                    .addClass('hide');

            // Add popover controls
            $popoverControls = $('<div class="form__actions form__actions--flush"><button type="submit" class="btn btn--primary is-disabled" data-ui="add-filter" disabled="disabled">Add</button><a type="link" data-ui="filter-cancel" data-filter-id="' + filterId + '" href="#" class="btn btn--naked">Cancel</a></div>');
            $popoverControls.insertAfter($formGroup);

            // Refresh the select2
            $select2 = $popoverContent.find('.js-select2');
            select2Placeholder = $select2.attr('placeholder');
            $select2.select2({placeholder: select2Placeholder});

            // Trigger popover with form field on added label
            $filterLabel.popover({
                html: true,
                title: function () {
                    return filterTitle
                },
                content: function () {
                    return $popoverContent;
                },
                placement: 'bottom',
                trigger: 'manual'
            });

            // Hide the filter list popover
            $addFilterButton.popover('hide');

            // Show the popover
            $filterLabel.popover('show');

            // Disable the add filter button
            $addFilterButton
                .addClass('is-disabled')
                .attr('disabled', true)
                .attr('aria-disabled', true);

            // Hide the filter list button if no links remaining
            filterListButtonVisibility(component);

            // Focus on field to avoid unnecessary extra click
            if ($field.hasClass('js-select2')) {
                $field.select2('open');
            } else {
                $field.focus();
            }

            // Enable button when field has value
            $field.on('change keyup', function(e) {
                if ($field.val()) {
                    $popoverControls
                        .find('[data-ui="add-filter"]')
                        .removeClass('is-disabled')
                        .attr('disabled', false)
                        .attr('aria-disabled', false);
                } else {
                    $popoverControls
                        .find('[data-ui="add-filter"]')
                        .addClass('is-disabled')
                        .attr('disabled', true)
                        .attr('aria-disabled', true);
                }
            });
        }
    });
}

function addFilter (component) {
    component.$html.on('click', '[data-ui="add-filter"]', function(e) {
        var $field = $(this).closest('.added-popover-content').find('.form__control'),
            $popover = $(this).closest('.popover'),
            $formGroup = $popover.find('.form__group'),
            $label = $popover.prev('.label'),
            $addFilterButton = component.$container.find('[data-ui="show-filter-list"]'),
            $legend = component.$container.find('form fieldset legend'),
            values,
            valueForLabel = null,
            filterId;

        e.preventDefault();

        // Check if field is a select2
        if ($field.hasClass('js-select2')) {

            values = $field.select2('data');

            $.each(values, function( index, value ) {
                if (valueForLabel == null) {
                    valueForLabel = value.text;
                } else {
                    valueForLabel = valueForLabel + ', ' + value.text;
                }
            });

        } else {
            valueForLabel = $field.val();
        }

        // Add it to the label
        $label
            .find('.chosen-filter')
            .text(': ' + valueForLabel);

        // Add the remove button to the label
        filterId = $label.attr('data-filter-id');
        $label.append('<a data-ui="filter-cancel" class="btn remove-button" data-filter-id="'+ filterId +'"><i class="icon-remove-sign"></i></a>');

        // Swap classes
        $label
            .removeClass('label--primary')
            .addClass('label--inverse');

        // Hide the field
        $formGroup.addClass('display--none');

        // Move the form group out of the popover and back into the filterbar form
        $formGroup.insertAfter($legend);

        // Close popover and destroy to prevent an empty popover showing on label click
        $label.popover('destroy');

        // Enable add filter button
        $addFilterButton.removeClass('is-disabled')
            .attr('disabled', false)
            .attr('aria-disabled', false);

        // Check if save button should be visible
        formActionsVisibility(component);
    });
}

function removeFilter (component) {
    var $addFilterButton = component.$container.find('[data-ui="show-filter-list"]');

    component.$html.on('click', '[data-ui="filter-cancel"]', function(e) {
        var filterId = $(this).attr('data-filter-id'),
            $legend = component.$container.find('form fieldset legend'),
            $field = component.$container.find('#' + filterId),
            $formGroup = $field.closest('.form__group'),
            $filterLabel,
            $hiddenFilterListItem,
            $label;

        e.preventDefault();

        if ($(this).parents('.popover').length) {
            $label = $(this).closest('.popover').prev('.label');
        } else {
            $label = $(this).closest('.label');
        }

        // Add option back to list
        updateFilterList($addFilterButton, filterId, 'show');

        // Empty values from field
        if ($field[0].type == 'select-one' || $field[0].type == 'select-multiple') {
            $field.find('option:selected').prop('selected', false);
        } else if ($field[0].type == 'checkbox') {
            $field.prop('checked', false);
        } else {
            $field.val('');
        }

        // Destroy select2
        if ($field.hasClass('js-select2')) {
            $field.select2('destroy');
        }

        // Hide the field
        $formGroup.addClass('display--none');

        // Move the form group out of the popover and back into the form
        $formGroup.insertAfter($legend);

        // Remove the popover and label
        $label.popover('hide');
        $label.remove();

        // Enable add filter button
        $addFilterButton
            .removeClass('is-disabled')
            .attr('disabled', false)
            .attr('aria-disabled', false);

        // Find any open add filter button popover
        $addFilterButton.popover('hide');

        // Check if button should be visible
        filterListButtonVisibility(component);

        // Check if save button should be visible
        formActionsVisibility(component);
    });
}

function filterListButtonVisibility (component) {
    var $addFilterButton = component.$container.find('[data-ui="show-filter-list"]'),
        addFilterList,
        $addFilterList;

    addFilterList = $addFilterButton.attr('data-content');
    $addFilterList = $(addFilterList);

    if ($addFilterList.find('li:not(.display--none)').length) {
        $addFilterButton.removeClass('display--none');
    } else {
        $addFilterButton.addClass('display--none');
    }
}

function formActionsVisibility (component) {
    var $formActions = component.$container.find('.form__actions');

    if (component.$container.find('.label').length) {
        $formActions.removeClass('display--none');
    } else {
        $formActions.addClass('display--none');
    }
}

function clearAllFilters (component) {
    var $addFilterButton = component.$container.find('[data-ui="show-filter-list"]');

    component.$html.on('click', '[data-ui="clear-all-filters"]', function(e) {

        e.preventDefault();

        // Close filter bar
        component.$container.addClass('display--none');

        // Remove all labels
        component.$container.find('.label').remove();

        // Reset filter list
        updateFilterList($addFilterButton, null, 'reset');

        // Hide form actions
        formActionsVisibility(component);

        // Reset form
        component.$container.find('form').trigger('reset');
    });
}

function updateFilterList ($addFilterButton, filterId, visibility) {
    var addFilterList = $addFilterButton.attr('data-content'),
        $addFilterList = $(addFilterList),
        $filterItem,
        $filterItemParent;

    if (filterId !== null) {
        $filterItem = $addFilterList.find('[data-filter-id="' + filterId + '"]');
        $filterItemParent = $filterItem.parent();
    }

    if (visibility === 'show') {
        $filterItemParent.removeClass('display--none');
    } else if (visibility === 'hide') {
        $filterItemParent.addClass('display--none');
    } else if (visibility === 'reset') {
        $addFilterList.find('li.display--none').removeClass('display--none');
    }

    $addFilterButton.attr('data-content', $addFilterList[0].outerHTML);
}

module.exports = FilterBarComponent;

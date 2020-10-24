# We need "press keys" to type into the React form's fields, but that doesn't work on IE.
@no_ie
@no_mobile
Feature: Using the Lesson Edit Page
  Scenario: Save changes using the lesson edit page
    Given I create a levelbuilder named "Levi"
    And I create a temp script and lesson
    And I view the temp lesson edit page

    # Match the text 'Editing Lesson "Temp Lesson"'
    And element "h1" contains text "Editing Lesson"
    And element "h1" contains text "Temp Lesson"

    And element ".uitest-activity-card" is visible

    And I press keys "Temp Activity" for element ".uitest-activity-name-input"
    And I press backspace to clear element ".uitest-activity-duration-input"
    And I press keys "15" for element ".uitest-activity-duration-input"
    And I click "button[type='submit']" to load a new page

    # Make sure the lesson overview page updated correctly
    And I wait until element "#show-container" is visible
    And element "h2" contains text "Temp Activity (15 minutes)"

    # Make sure the lesson edit page updated correctly
    And I view the temp lesson edit page
    And element ".uitest-activity-name-input" has value "Temp Activity"
    And element ".uitest-activity-duration-input" has value "15"

    And I delete the temp script and lesson

  Scenario: Add a level using the lesson edit page
    Given I create a levelbuilder named "Levi"
    And I create a temp script and lesson
    And I view the temp lesson edit page
    And I wait until element ".uitest-activity-card" is visible
    And element ".uitest-open-add-level-button" is visible
    And element ".uitest-bubble" contains text "1"
    And element ".uitest-bubble" does not contain text "2"

    # Open the Add Level dialog, search for an artist level and add the first one

    # TODO: use regular click instead once button responds to click events
    When execute JavaScript expression "$('.uitest-open-add-level-button').simulate('mousedown')"
    And I wait until element "h2" contains text "Add Levels"
    And I wait until element "#add-level-type" is visible
    # If the next step fails, we should consider replacing "Artist" with any other
    # level type which does not appear in the initial view, here and below.
    And element "td" does not contain text "Artist"
    And I select the "Artist" option in dropdown "add-level-type"
    And element ".fa-search" is visible
    And I press ".fa-search" using jQuery
    # We will know the search has completed after the following step, because we
    # confirmed earlier that there were no Artist levels in the initial view.
    And I wait until element "td" contains text "Artist"
    And element ".fa-plus" is visible
    And I press the first ".fa-plus" element
    # TODO: change to not use jquery once button is not obscured
    And I press ".save-add-levels-button" using jQuery
    And I wait until element "h2" does not contain text "Add Levels"

    # Verify lesson editor updated
    Then element ".uitest-bubble" contains text "1"
    And element ".uitest-bubble" contains text "2"

    # Verify lesson overview updated
    When I click "button[type='submit']" to load a new page
    And I wait until element "#show-container" is visible
    And I wait until element ".uitest-bubble" contains text "1"
    Then element ".uitest-bubble" contains text "2"

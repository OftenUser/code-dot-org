require 'test_helper'

class TeacherApplicationHelperTest < ActionView::TestCase
  include TeacherApplicationHelper

  def sign_in(user)
    # override the default sign_in helper because we don't actually have a request or anything here
    stubs(:current_user).returns user
  end

  setup_all do
    @user_with_two_incomplete_apps = create :teacher
    @incomplete_application = create TEACHER_APPLICATION_FACTORY, user: @user_with_two_incomplete_apps, status: 'incomplete'
    create TEACHER_APPLICATION_FACTORY, user: @user_with_two_incomplete_apps, status: 'incomplete', application_year: '2018-2019'

    @user_with_reopened_app = create :teacher
    @reopened_application = create TEACHER_APPLICATION_FACTORY, user: @user_with_reopened_app, status: 'reopened'

    @user_with_outdated_incomplete = create :teacher
    @not_current_incomplete_app = create TEACHER_APPLICATION_FACTORY,
      user: @user_with_outdated_incomplete,
      status: 'incomplete',
      application_year: '2018-2019'

    @user_with_outdated_reopened = create :teacher
    @not_current_reopened_app = create TEACHER_APPLICATION_FACTORY,
      user: @user_with_outdated_reopened,
      status: 'reopened',
      application_year: '2018-2019'
  end

  test 'current application returns user\'s application from this year' do
    sign_in @user_with_two_incomplete_apps
    assert_equal @incomplete_application.id, current_application.id
  end

  test 'current application returns nil if user has no application from this year' do
    sign_in @teacher_with_not_current_incomplete_app
    assert_nil current_application
  end

  test "has_incomplete_application" do
    [
      {
        expected_output: true,
        condition_message: 'application exists and is incomplete',
        user: @user_with_two_incomplete_apps
      },
      {
        expected_output: false,
        condition_message: 'application exists and is reopened',
        user: @user_with_reopened_app
      },
      {
        expected_output: false,
        condition_message: 'application is in a different year',
        user: @user_with_outdated_incomplete
      }
    ].each do |expected_output:, user:, condition_message:|
      sign_in user
      assert has_incomplete_application?, "expected true when #{condition_message}" if expected_output
      refute has_incomplete_application?, "expected false when #{condition_message}" unless expected_output
    end
  end

  test "has_reopened_application" do
    [
      {
        expected_output: true,
        condition_message: 'application exists and is reopened',
        user: @user_with_reopened_app
      },
      {
        expected_output: false,
        condition_message: 'application exists and is incomplete',
        user: @user_with_two_incomplete_apps
      },
      {
        expected_output: false,
        condition_message: 'application is in a different year',
        user: @user_with_outdated_reopened
      }
    ].each do |expected_output:, user:, condition_message:|
      sign_in user
      assert has_reopened_application?, "expected true when #{condition_message}" if expected_output
      refute has_reopened_application?, "expected false when #{condition_message}" unless expected_output
    end
  end
end

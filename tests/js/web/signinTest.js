'use strict';

var $ = require('jquery'),
	SignInComponent = require('../../../js/area/signin/signin');

describe('Sign-in module', function() {

	beforeEach(function() {
		this.$html = $('<html></html>');
		this.$body = $('<body></body').appendTo(this.$html);
		this.$module = $('\
<div class="video">\
	<img class="signin-brand" src="../../../../images/branding/jadu-white.svg" />\
\
	<div class="signin-container">\
\
		<div class="signin">\
			<div class="signin__inner">\
				<form class="signin__panel signin-form" aria-hidden="false">\
					<div class="signin__icon"></div>\
\
					<span class="signin__info" role="alert">Site Name</span>\
\
					<div class="signin__group">\
						<label for="username">Username (required)</label>\
						<input\
							autofocus\
							autocapitalize="off"\
							autocomplete="off"\
							autocorrect="off"\
							class="signin__input"\
							id="username"\
							name="username"\
							type="text"\
							placeholder="username"\
							autocomplete="off"\
							tabindex="1"\
						/>\
					</div>\
\
					<div class="signin__group">\
						<label for="password">Password (required)</label>\
						<input\
							autocapitalize="off"\
							autocomplete="off"\
							autocorrect="off"\
							class="signin__input"\
							id="password"\
							name="password"\
							placeholder="password"\
							tabindex="2"\
							type="password"\
						/>\
					</div>\
\
					<div class="signin__actions">\
						<button class="btn btn--primary signin__submit" name="signin-submit" type="submit" tabindex="3">Sign In</button>\
					</div>\
\
					<a class="signin__link" href="#forgot" tabindex="4">Forgotten password?</a>\
				</form>\
\
				<form class="signin__panel signin-reset" aria-hidden="true">\
					<div class="signin__icon"></div>\
\
					<span class="signin__info" role="alert">Enter the email address you use for your Jadu account and we’ll send you a link to reset your password</span>\
\
					<div class="signin__group">\
						<label for="reset-email">Email address (required)</label>\
						<input\
							autocapitalize="off"\
							autocomplete="off"\
							autocorrect="off"\
							class="signin__input"\
							id="reset-email"\
							name="reset-email"\
							placeholder="Email address"\
							tabindex="-1"\
							type="email"\
							disabled="disabled"\
						/>\
					</div>\
\
					<div class="signin__actions">\
						<button class="btn btn--primary signin__submit" name="reset-submit" type="submit" tabindex="-1" disabled="disabled">Email Me</button>\
					</div>\
\
					<a class="signin__link" href="#" tabindex="-1" disabled="disabled">Don’t know your email address?</a><br />\
					<a class="signin__link" href="#signin" tabindex="-1" disabled="disabled">Cancel</a>\
				</form>\
\
				<form class="signin__panel signin-twostep" aria-hidden="true" name="twostep">\
					<div class="signin__icon"></div>\
\
						<span class="signin__info" role="alert">Two-step verification is enabled for your account.<br />Enter the code generated by your <a href="#">authenticator app</a></span>\
\
						<div class="signin__group">\
							<label for="twoStepOne">First three digits of two-step verification code (required)</label>\
							<input\
								autofocus\
								autocapitalize="off"\
								autocomplete="off"\
								autocorrect="off"\
								class="signin__code1"\
								id="twoStepOne"\
								maxlength="3"\
								name="twoStepOne"\
								placeholder="123"\
								tabindex="-1"\
								type="text"\
								disabled="disabled"\
							/>\
							<label for="twoStepTwo">second three digits of two-step verification code (required)</label>\
							<input\
								autocapitalize="off"\
								autocomplete="off"\
								autocorrect="off"\
								class="signin__code2"\
								autocomplete="off"\
								id="twoStepTwo"\
								maxlength="3"\
								name="twoStepTwo"\
								placeholder="456"\
								type="text"\
								tabindex="-1"\
								disabled="disabled"\
							/>\
						</div>\
					</div>\
\
					<div class="signin__actions">\
						<button class="btn btn--primary signin__submit" name="signin-twostep" type="submit" tabindex="-1" disabled="disabled">Verify Me</button>\
					</div>\
\
					<a class="signin__link" href="#" tabindex="-1" disabled="disabled">What does this mean?</a>\
				</form>\
\
				<div class="signin__panel signin-success">\
					<div class="signin__icon"></div>\
				</div>\
\
			</div>\
		</div>\
	</div>\
</div>').appendTo(this.$html);

		$.fn.placeholder = sinon.stub().returnsThis();

		this.$container = this.$html.find('.signin');
		this.$signInPane = this.$html.find('.signin-form');
		this.$innerPane = this.$html.find('.signin__inner');
		this.$forgotLink = this.$html.find('[href="#forgot"]');
		this.$signInLink = this.$html.find('[href="#signin"]');
		this.$usernameField = this.$html.find('[name="username"]');
		this.$passwordField = this.$html.find('[name="password"]');
		this.$emailField = this.$html.find('[name="reset-email"]');
		this.$signInButton = this.$html.find('[name="signin-submit"]'),
		this.$info = this.$html.find('.signin-form .signin__info'),
		this.$twoStepOne = this.$html.find('[name="twoStepOne"]'),
		this.$twoStepTwo = this.$html.find('[name="twoStepTwo"]');

		this.signIn = new SignInComponent(this.$html);

	});

	describe('the default state of the sign in dialog', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});


		it('should have the autofocus property on the username field', function() {
			expect(this.$usernameField.prop('autofocus')).to.be.true;
		});

		it('not allow elements in the reset pane to be tabbed to', function() {
			expect(this.$emailField.prop('tabindex')).to.equal(-1);
		});
	});

	describe('clicking the forgotten password link', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.$forgotLink.click();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should not focus anything before transition', function() {
			expect($.fn.focus).not.to.have.been.called;
		});

		it('should add the active-reset class to the container', function() {
			expect(this.$container.hasClass('active-reset')).to.be.true;
		});

		it('should not autofocus the email address field before transition', function() {
			expect(this.$emailField.prop('autofocus')).to.be.false;
		});

		it('should focus something after transition', function() {
			this.$innerPane.trigger('transitionend');
			expect($.fn.focus).to.have.been.calledOnce;
		});

		it('should focus the email address field after transition', function() {
			this.$innerPane.trigger('transitionend');
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$emailField);
			}.bind(this)));
		});

		it('should not have any incomplete field hints', function() {
			this.$innerPane.trigger('transitionend');
			expect(this.$html.find('.signin__hint').length).to.equal(0);
		});
	});

	describe('resetting the UI state', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should not have any incomplete field hints', function() {
			this.$signInButton.click();
			this.$innerPane.trigger('transitionend');
			this.$forgotLink.click();
			this.$innerPane.trigger('transitionend');
			this.signIn.reset();
			expect(this.$html.find('.signin__hint').length).to.equal(0);
		});

	});

	describe('clicking the cancel link on the forgotten password pane', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.$forgotLink.click();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should only have the default class on the container', function() {
			this.$signInLink.click();
			this.$innerPane.trigger('transitionend');
			expect(this.$container.attr('class')).to.equal('signin');
		});

		it('should focus the username field after transition', function() {
			this.$signInLink.click();
			this.$innerPane.trigger('transitionend');
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$usernameField);
			}.bind(this)));
		});
	});

	describe('pressing escape on the forgotten password pane', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.$forgotLink.click();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should cause the inner pane to only have the default class', function() {
			this.$innerPane.trigger('transitionend');

			var keyupEvent = $.Event('keyup', { keyCode: 27 });
			$(document).trigger(keyupEvent);

			this.$innerPane.trigger('transitionend');

			expect(this.$innerPane.attr('class')).to.equal('signin__inner');
		});
	});

	describe('attempting to reset my password without providing an email address', function() {
		//TODO
	});

	describe('attempting to sign in with no details', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.$signInButton.click();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should add the shake class to the main container', function() {
			expect(this.$container.hasClass('shake')).to.be.true;
		});

		it('should remove the shake class after the animation completes', function() {
			this.$innerPane.trigger('animationend');
			expect(this.$container.hasClass('shake')).to.be.false;
		});

		it('should replace the info string with details of what went wrong', function() {
			this.$info.finish();
			expect(this.$info.text()).to.equal('Enter your username and password');
		});

		it('should focus the username field', function() {
			this.$innerPane.trigger('animationend');
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$usernameField);
			}.bind(this)));
		});

		it('should add a hint element before the username field', function() {
			expect(this.$usernameField.prev().hasClass('signin__hint')).to.be.true;
		});
	});


	describe('attempting to sign in a username, but no password', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.$usernameField.val('username');
			this.$signInButton.click();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should add the shake class to the main container', function() {
			expect(this.$container.hasClass('shake')).to.be.true;
		});

		it('should remove the shake class after the animation completes', function() {
			this.$innerPane.trigger('animationend');
			expect(this.$container.hasClass('shake')).to.be.false;
		});

		it('should replace the info string with details of what went wrong', function() {
			this.$info.finish();
			expect(this.$info.text()).to.equal('Enter your password');
		});

		it('should focus the password field', function() {
			this.$innerPane.trigger('animationend');
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$passwordField);
			}.bind(this)));
		});

		it('should add a hint element before the password field', function() {
			expect(this.$passwordField.prev().hasClass('signin__hint')).to.be.true;
		});
	});

	describe('attempting to sign in with a password, but no username', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.$passwordField.val('password');
			this.$signInButton.click();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should add the shake class to the main container', function() {
			expect(this.$container.hasClass('shake')).to.be.true;
		});

		it('should remove the shake class after the animation completes', function() {
			this.$innerPane.trigger('animationend');
			expect(this.$container.hasClass('shake')).to.be.false;
		});

		it('should replace the info string with details of what went wrong', function() {
			this.$info.finish();
			expect(this.$info.text()).to.equal('Enter your username');
		});

		it('should focus the username field', function() {
			this.$innerPane.trigger('animationend');
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$usernameField);
			}.bind(this)));
		});

		it('should add a hint element before the username field', function() {
			expect(this.$usernameField.prev().hasClass('signin__hint')).to.be.true;
		});
	});

	describe('an invalid login', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.signIn.signinFail();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should add the ‘signin-error’ class to the container', function() {
			expect(this.$container.hasClass('signin--error')).to.be.true;
		});

		it('should replace the info string with details of what went wrong', function() {
			this.$info.finish();
			expect(this.$info.text()).to.equal('Your username and/or password was incorrect');
		});

		it('should replace the sign-in button value with ‘Try Again’', function() {
			this.$signInButton.finish();
			expect(this.$signInButton.html()).to.equal('Try Again');
		});

		it('should focus the username field', function() {
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$usernameField);
			}.bind(this)));
		});
	});

	describe('pressing escape after an invalid login', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.signIn.signinFail();
			this.$container.finish();

			var keyupEvent = $.Event('keyup', { keyCode: 27 });
			$(document).trigger(keyupEvent);

			this.$container.finish();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should cause the container to only have the default class', function() {
			expect(this.$container.attr('class')).to.equal('signin');
		});

		it('should replace the original value of the info string', function() {
			expect(this.$info.text()).to.equal('Site Name');
		});

		it('should focus the username field', function() {
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$usernameField);
			}.bind(this)));
		});
	});

	describe('the two-step verification form', function() {

		beforeEach(function() {
			sinon.spy($.fn, 'focus');
			this.signIn.initialize();
			this.signIn.twoStep();
			this.$container.finish();
		});

		afterEach(function () {
			$.fn.focus.restore();
		});

		it('should focus the first field', function() {
			this.$innerPane.trigger('transitionend');
			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$twoStepOne);
			}.bind(this)));
		});

		it('should focus the second field when the first has been filled in', function() {
			this.$innerPane.trigger('transitionend');

			this.$twoStepOne.val('123');

			var keyupEvent = $.Event('keyup', { keyCode: 52 }); // #4
			this.$twoStepOne.trigger(keyupEvent);

			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$twoStepTwo);
			}.bind(this)));
		});


		it('should allow the second field to be focused', function() {
			this.$innerPane.trigger('transitionend');

			$.fn.focus.reset();

			this.$twoStepTwo.focus();

			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$twoStepTwo);
			}.bind(this)));
		});

		it('should focus the first field if the second field is cleared', function() {
			this.$innerPane.trigger('transitionend');

			this.$twoStepTwo.focus();
			$.fn.focus.reset();

			var keyEvent = $.Event('keyup', { keyCode: 8 }); // backspace
			this.$twoStepTwo.trigger(keyEvent);

			expect($.fn.focus).to.have.been.calledOn(sinon.match(function ($collection) {
				return $($collection).is(this.$twoStepOne);
			}.bind(this)));
		});

	});
});
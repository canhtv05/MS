'use client';

const LoginPage = () => {
  return (
    <div
      id="login-container"
      className="min-h-screen gradient-bg relative overflow-hidden section-clickable"
    >
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>
      <div className="floating-shape"></div>

      <div className="min-h-screen flex items-center justify-center px-4 py-12 relative z-10">
        <div
          id="login-card"
          className="glass-effect rounded-3xl p-8 md:p-12 w-full max-w-md shadow-2xl section-clickable"
        >
          <div id="logo-section" className="text-center mb-8 section-clickable">
            <div className="logo-glow inline-block">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-400 to-cyan-400 flex items-center justify-center">
                <i className="text-white text-2xl" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-bolt"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fas"
                    data-icon="bolt"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M349.4 44.6c5.9-13.7 1.5-29.7-10.6-38.5s-28.6-8-39.9 1.8l-256 224c-10 8.8-13.6 22.9-8.9 35.3S50.7 288 64 288H175.5L98.6 467.4c-5.9 13.7-1.5 29.7 10.6 38.5s28.6 8 39.9-1.8l256-224c10-8.8 13.6-22.9 8.9-35.3s-16.6-20.7-30-20.7H272.5L349.4 44.6z"
                    ></path>
                  </svg>
                </i>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-purple-100 text-sm">Sign in to continue your journey</p>
          </div>

          <form id="login-form" className="space-y-6 section-clickable">
            <div id="email-field" className="space-y-2 section-clickable">
              <label className="text-purple-100 text-sm font-medium block">Email or Username</label>
              <input
                type="text"
                className="input-glow w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:border-purple-300 transition-all duration-300"
                placeholder="Enter your email or username"
              />
            </div>

            <div id="password-field" className="space-y-2 section-clickable">
              <label className="text-purple-100 text-sm font-medium block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  className="input-glow w-full px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-purple-200 focus:outline-none focus:border-purple-300 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-200 hover:text-white transition-colors"
                >
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-eye"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="far"
                      data-icon="eye"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"
                      ></path>
                    </svg>
                  </i>
                </button>
              </div>
            </div>

            <div
              id="options-section"
              className="flex items-center justify-between section-clickable"
            >
              <label className="flex items-center text-purple-100 text-sm">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <a href="#" className="text-cyan-300 text-sm hover:text-cyan-200 transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              id="login-button"
              type="submit"
              className="btn-glow w-full py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold text-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 section-clickable"
            >
              Sign In
            </button>
          </form>

          <div id="divider-section" className="my-8 section-clickable">
            <div className="flex items-center">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-4 text-purple-100 text-sm">or continue with</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
          </div>

          <div id="social-login" className="space-y-4 section-clickable">
            <button className="social-btn w-full py-3 px-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center space-x-3 hover:bg-white/20 transition-all duration-300">
              <i className="text-red-400" data-fa-i2svg="">
                <svg
                  className="svg-inline--fa fa-google"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                  data-fa-i2svg=""
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
              </i>
              <span>Continue with Google</span>
            </button>

            <div className="grid grid-cols-2 gap-4">
              <button className="social-btn py-3 px-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center space-x-2 hover:bg-white/20 transition-all duration-300">
                <i className="text-blue-400" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-facebook"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="facebook"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"
                    ></path>
                  </svg>
                </i>
                <span>Facebook</span>
              </button>

              <button className="social-btn py-3 px-4 rounded-2xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center space-x-2 hover:bg-white/20 transition-all duration-300">
                <i className="text-sky-400" data-fa-i2svg="">
                  <svg
                    className="svg-inline--fa fa-twitter"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="twitter"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    data-fa-i2svg=""
                  >
                    <path
                      fill="currentColor"
                      d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                    ></path>
                  </svg>
                </i>
                <span>Twitter</span>
              </button>
            </div>
          </div>

          <div id="signup-link" className="text-center mt-8 section-clickable">
            <p className="text-purple-100 text-sm">
              {`Don't have an account?`}
              <a
                href="#"
                className="text-cyan-300 hover:text-cyan-200 font-medium transition-colors"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

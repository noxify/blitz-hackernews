import { Fragment } from "react"
import { Disclosure, Menu, Transition } from "@headlessui/react"
import { Bars3Icon as MenuIcon, UserIcon, XMarkIcon as XIcon } from "@heroicons/react/24/outline"
import classNames from "classnames"
import { useMutation } from "@blitzjs/rpc"
import Logo from "app/core/components/partials/Logo"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import logout from "app/auth/mutations/logout"
import Link from "next/link"
import { format, sub } from "date-fns"

const user = {
  name: "Tom Cook",
  email: "tom@example.com",
  imageUrl:
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
}
const navigation = [
  { name: "Latest", href: "/", alias: "home" },
  {
    name: "Past",
    href: `/past/${format(sub(new Date(), { days: 1 }), "yyyy-MM-dd")}`,
    alias: "past",
  },
  { name: "Ask", href: "/ask", alias: "ask" },
  { name: "Show", href: "/show", alias: "show" },
  { name: "Tell", href: "/tell", alias: "tell" },
  { name: "Submit", href: "/entries/new", alias: "submit" },
]
const userNavigation = [
  { name: "Your Profile", href: "/profile" },
  { name: "Settings", href: "/settings" },
]

const guestNavigation = [
  {
    name: "Login",
    href: "/auth/login",
  },
  {
    name: "Sign up",
    href: "/auth/signup",
  },
]

export default function Header({ currentItem }: { currentItem?: string }) {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  const userMenu = currentUser ? userNavigation : guestNavigation

  return (
    <>
      <Disclosure as="nav" className="bg-orange-600">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Logo className="w-auto h-12 py-2 fill-white" />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link key={item.name} href={item.href}>
                          <a
                            className={classNames(
                              currentItem == item.alias
                                ? "bg-orange-200 text-gray-600"
                                : "text-white hover:bg-orange-500 hover:bg-opacity-75",

                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={currentItem == item.alias ? "page" : undefined}
                          >
                            {item.name}
                          </a>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* Profile dropdown */}
                    <Menu as="div" className="ml-3 relative">
                      <div>
                        <Menu.Button className="max-w-xs bg-indigo-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-500 focus:ring-white">
                          <span className="sr-only">Open user menu</span>
                          <UserIcon className="h-8 w-8 p-2 text-gray-400 rounded-full bg-gray-100" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userMenu.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <Link
                                  href={item.href}
                                  legacyBehavior={false}
                                  className={classNames(
                                    active ? "bg-gray-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  {item.name}
                                </Link>
                              )}
                            </Menu.Item>
                          ))}
                          {currentUser && (
                            <Menu.Button
                              as="a"
                              onClick={async () => {
                                await logoutMutation()
                              }}
                              className="block px-4 py-2 text-sm text-gray-700 cursor-pointer"
                            >
                              Logout
                            </Menu.Button>
                          )}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="bg-orange-200 inline-flex items-center justify-center p-2 rounded-md text-orange-400 hover:text-white hover:bg-orange-100 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-500 focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      currentItem == item.alias
                        ? "bg-orange-200 text-gray-600"
                        : "text-white hover:bg-orange-500 hover:bg-opacity-75",
                      "block px-3 py-2 rounded-md text-base font-medium"
                    )}
                    aria-current={currentItem == item.alias ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-orange-700">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    <UserIcon className="h-10 w-10 p-2 text-gray-400 rounded-full bg-gray-100" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.name}</div>
                    <div className="text-sm font-medium text-orange-300">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  {userMenu.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-orange-500 hover:bg-opacity-75"
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}

                  {currentUser && (
                    <Disclosure.Button
                      as="a"
                      onClick={async () => {
                        await logoutMutation()
                      }}
                      className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-orange-500 hover:bg-opacity-75 cursor-pointer"
                    >
                      Logout
                    </Disclosure.Button>
                  )}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  )
}

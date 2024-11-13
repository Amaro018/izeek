"use client"
import { AuthenticationError, PromiseReturnType } from "blitz"
import Link from "next/link"
import { LabeledTextField } from "src/app/components/LabeledTextField"
import { Form, FORM_ERROR } from "src/app/components/Form"
import login from "../mutations/login"
import { Login } from "../validations"
import { useMutation } from "@blitzjs/rpc"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import type { Route } from "next"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  const router = useRouter()
  const next = useSearchParams()?.get("next")
  return (
    <>
      <div className="flex justify-center p-16">
        <div className="flex flex-col justify-center w-1/4 border border-orange-400 rounded-lg p-8">
          <h1 className="text-4xl font-bold text-center">ADMIN LOGIN</h1>
          <div className="py-8">
            <Form
              schema={Login}
              initialValues={{ email: "", password: "" }}
              onSubmit={async (values) => {
                try {
                  await loginMutation(values)
                  router.refresh()
                  if (next) {
                    router.push(next as Route)
                  } else {
                    router.push("/admin/dashboard")
                    router.refresh()
                    console.log("redirecting to dashboard")
                  }
                } catch (error: any) {
                  if (error instanceof AuthenticationError) {
                    return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
                  } else {
                    return {
                      [FORM_ERROR]:
                        "Sorry, we had an unexpected error. Please try again. - " +
                        error.toString(),
                    }
                  }
                }
              }}
            >
              <LabeledTextField name="email" label="Email" placeholder="Email" className="w-full" />
              <LabeledTextField
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
                className="w-full"
              />
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded"
                type="submit"
              >
                Login
              </button>
              <div>
                <Link href={"/forgot-password"}>Forgot your password?</Link>
              </div>
            </Form>
          </div>

          {/* <div style={{ marginTop: "1rem" }}>
        Or <Link href="/signup">Sign Up</Link>
        </div> */}
        </div>
      </div>
    </>
  )
}

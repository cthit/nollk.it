import { NextPage } from "next"
import Head from "next/head"
import { useRef, useState } from "react"
import Button from "../components/Button"
import Page from "../components/Page"

const Login: NextPage = () => {

  const [pw, setpw] = useState("")
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const pwBorderRef = useRef<HTMLDivElement>(null)

  const submit = async () => {

    if (pw) {
      fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: pw
        })
      }).then(
        res => {
          if (res.ok) {
            window.location.href = "/admin"
          } else {
            setpw("")
            setButtonDisabled(true)
            pwBorderRef.current?.classList.add("border-red-500")
          }
        }
      )
    }
  }

  return (
    <>
      <Page blackout>
        <div className="flex flex-col justify-center h-screen gap-6">
          <div ref={pwBorderRef} className="border rounded-lg transition-colors">
            <input type="password" value={pw} placeholder="Lösenord" className="px-3 py-2 bg-transparent outline-none appearance-none"
              onKeyDown={e => {
                if (e.key === "Enter") {
                  submit()
                }
              }}
              onChange={e => {
                setpw(e.target.value)

                if (e.target.value === "") {
                  setButtonDisabled(true)
                } else {
                  setButtonDisabled(false)
                }
              }}
              onBlur={() => {
                pwBorderRef.current?.classList.remove("border-red-500")
              }}
            />
          </div>
          <div className="flex justify-center">
            <Button disabled={buttonDisabled} action={submit}>Logga in</Button>
          </div>
        </div>
      </Page>
    </>
  )
}

export default Login
const express = require("express")
const crypto = require("crypto")

const app = express()
app.use(express.json())

const SECRET_KEY = crypto
  .createHash("sha256")
  .update("my-super-secret-key")
  .digest()

const IV = Buffer.alloc(16, 0) // demo only

function encrypt(text) {
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV)
  let encrypted = cipher.update(text, "utf8", "base64")
  encrypted += cipher.final("base64")
  return encrypted
}

function decrypt(encrypted) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV)
  let decrypted = decipher.update(encrypted, "base64", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

app.post("/secure", (req, res) => {
  const encryptedPayload = req.body.data

  const decrypted = decrypt(encryptedPayload)
  console.log("Decrypted Request:", decrypted)

  const responsePayload = JSON.stringify({
    message: "Hello from secure server",
  })

  const encryptedResponse = encrypt(responsePayload)

  res.json({
    data: encryptedResponse,
  })
})

app.listen(3080, () => {
  console.log("Server running on http://localhost:3080")
})

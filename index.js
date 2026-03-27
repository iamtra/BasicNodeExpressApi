async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts")

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}


console.log(getUsers())
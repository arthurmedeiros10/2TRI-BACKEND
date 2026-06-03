app.get("/clientes", (req , res)=>{
    try{
        const clientes = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        res.status(200).json(clientes)
    } catch(error){
        res.status(500).json({resposta: error.message})
    }
})

app.listen(port, ()=>{
    console.log("Api executando na porta " + port)
})
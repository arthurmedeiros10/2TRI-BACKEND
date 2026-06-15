// npm init
// npm i express
// instalar extensão RapidAPI Client
const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
const fs = require('fs')

app.post("/clientes", (req,res) => {
    const cliente = req.body
    if (!cliente || Object.keys(cliente).length === 0) {
        res.status(400).json({resposta: "Body não preenchido"})
    } else {
        try {
            const bd = JSON.parse(fs.readFileSync('bd.json', 'utf8'))
            bd.push(cliente)
            fs.writeFileSync('bd.json', JSON.stringify(bd), 'utf8')
            res.status(200).json({resposta: "Cliente cadastrado com sucesso!"})
        } catch(error) {
            res.status(500).json({resposta: error.message})
        }
    }    
})

app.get("/clientes", (req, res) => {
    try {
        const clientes = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        res.status(200).json(clientes)
    } catch (error) {
        res.status(500).json({ resposta: error.message })
    }
})

app.get("/clientes/:cpf", (req, res) => {
    const cpf = req.params.cpf
    try {
        const clientes = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        const clienteEncontrado = clientes.find(
            (c) => c.cpf.replace(/[^\d]/g, '') == cpf
        )
        if (!clienteEncontrado) {
            return res.status(404).json({ resposta: "cliente não existe no banco de dados" })
        }
        res.status(200).json(clienteEncontrado)
    } catch (error) {
        res.status(500).json({ resposta: error.message })
    }
})

app.delete("/clientes/:cpf", (req, res) => {
    const cpf = req.params.cpf

    try{
        const clientes = JSON.parse(fs.readFileSync("bd.json", "utf8")) // Corrigido readFileSync
        const indice_cliente = clientes.findIndex(
            (cliente) => cliente.cpf.replace(/[^\d]/g, '') == cpf
        )
    if (indice_cliente == -1){
        return res.status(404).json ( // Corrigido res.status(404)
            {resposta: "cliente não existe no banco de dados"}
        )
    }
    clientes.splice(indice_cliente, 1) // Corrigido ortografia da variável
    fs.writeFileSync("bd.json", JSON.stringify (clientes), "utf8")
    res.status (200).json ({resposta: "Cliente deletado do banco de dados"})
} catch(error){
    res.status(500).json ({resposta: error.message})
}
})

app.put("/clientes/:cpf", (req, res) => {
    const cpf = req.params.cpf
    const dadosNovos = req.body
    try {
        const clientes = JSON.parse(fs.readFileSync("bd.json", "utf8"))
        const indice_cliente = clientes.findIndex(
            (cliente) => cliente.cpf.replace(/[^\d]/g, '') == cpf
        )
        if (indice_cliente == -1) {
            return res.status(404).json({ resposta: "cliente não existe no banco de dados" })
        }
        
        clientes[indice_cliente] = { ...clientes[indice_cliente], ...dadosNovos }
        fs.writeFileSync("bd.json", JSON.stringify(clientes), "utf8")
        res.status(200).json({ resposta: "Cliente atualizado com sucesso!" })
    } catch (error) {
        res.status(500).json({ resposta: error.message })
    }
})

app.get("/ola", (req, res)=>{
    res.json({resposta: "Olá Mundo!"})
})

app.listen(port, ()=>{
    console.log("API rodando na porta " + port)
})
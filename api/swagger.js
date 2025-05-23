import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: '3.0.4',
    info: {
        title: 'API do Gestor Financeiro Pessoal',
        version: '1.0.0',
        description: `API para gerenciamento financeiro pessoal desenvolvida no curso Técnico de Desenvolvimento de Sistemas do SENAI`
    },
    servers: [
        {
            url: 'http://localhost:3000/',
            description: 'Servidor Local'
        },
        {
            url: 'https://192.168.0.237:3000',
            description: 'Servidor de API do Douglas'
        }
    ],
    tags: [
        {
            name: 'Usuários',
            description: 'Rotas para cadastro, login, atualização e desativação de usuários'
        },
        {
            name: 'Categorias',
            description: 'Rotas para cadastro, leitura, atualização e desativação de categorias'
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    paths: {
        '/usuarios': {
            post: {
                tags: ['Usuarios'],
                summary: 'Cadastrar novo usuário',
                description: 'Método utilizado para cadastrar novos usuários',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Usuário cadastrado com sucesso' },
                    '400': { description: 'Erro ao cadastrar usuário' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            get: {
                tags: ['Usuarios'],
                summary: 'Listar todos os usuários',
                description: 'Método utilizado para listar todos os usuários cadastrados',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de usuários',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                            ativo: { type: 'boolean', example: true },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            
        },
        '/usuarios/{id}': {
            delete: {
                tags: ['Usuarios'],
                summary: 'Desativar usuário',
                description: 'Método utilizado para desativar um usuário',
                security: [
                    { 
                        bearerAuth: [], 
                    }
                ],
                parameters: [{
                    name: 'id',
                    in: 'path', //Caso queira passar como query in: 'query
                    required: true,
                    schema: {
                        type: 'integer',
                    }
                }],
                responses: {
                    '200': { description: 'Usuário desativado com sucesso' },
                    '400': { description: 'Erro ao desativar usuário' },
                    '500': { description: 'Erro interno do servidor' }
                }
                    
            },
            put: {
                tags: ['Usuarios'],
                summary: 'Atualizar usuário',
                description: 'Método utilizado para atualizar um usuário',
                security: [{ bearerAuth: [] }],
                parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'email', 'senha', 'tipo_acesso'],
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Usuário atualizado com sucesso' },
                    '400': { description: 'Erro ao atualizar usuário' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            patch: {
                tags: ['Usuarios'],
                summary: 'Atualizar usuario',
                description: 'Método utilizado para atualizar usuario',
                security: [{ bearerAuth: [] }],
                parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string', example: 'João Silva' },
                                    email: { type: 'string', example: 'joao@example.com' },
                                    senha: { type: 'string', example: '123' },
                                    tipo_acesso: { type: 'string', example: 'adm' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Categoria atualizada com sucesso' },
                    '400': { description: 'Erro ao atualizar categoria' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            
        },
        '/usuarios/login': {
            post: {
                tags: ['Usuarios'],
                summary: 'Login do usuário',
                description: 'Método utilizado para efetuar o login do usuário e gerar o token',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'senha'],
                                properties: {
                                    email: { type: 'string', example: 'sesia@sesi.br' },
                                    senha: { type: 'string', example: '123' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Usuário encontrado',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            token: { type: 'string', example: 'jwt.token.aqui' },
                                            id_usuario: { type: 'integer', example: 1 },
                                            nome: { type: 'string', example: 'João Silva' },
                                            email: { type: 'string', example: 'joao@example.com' },
                                            senha: { type: 'string', example: '123' },
                                            tipo_acesso: { type: 'string', example: 'adm' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '400': { description: 'Erro ao encontrar usuário' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            
        },
        '/categorias': {
            post: {
                tags: ['Categorias'],
                summary: 'Nova categoria',
                description: 'Rota para cadastrar uma nova categoria',
                security: [
                    { 
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario', 'cor', 'icone'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: '#fff' },
                                    icone: { type: 'string', example: 'save' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Categoria cadastrada com sucesso' },
                    '400': { description: 'Erro ao cadastrar categoria' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            get: {
                tags: ['Categorias'],
                summary: 'Listar todos as categorias',
                description: 'Método utilizado para listar todos as categorias cadastrados',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de categorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            nome: { type: 'string', example: 'Alimentação' },
                                            tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            id_usuario: { type: 'integer', example: 1 },
                                            cor: { type: 'string', example: '#fff' },
                                            icone: { type: 'string', example: 'save' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
        },
        '/categorias/{id}': {
            delete: {
                tags: ['Categorias'],
                summary: 'Desativar categoria',
                description: 'Método utilizado para desativar uma categoria',
                security: [
                    { 
                        bearerAuth: [], 
                    }
                ],
                parameters: [{
                    name: 'id_categoria',
                    in: 'path', //Caso queira passar como query in: 'query
                    required: true,
                    schema: {
                        type: 'integer',
                    }
                }],
                responses: {
                    '200': { description: 'Usuário desativado com sucesso' },
                    '400': { description: 'Erro ao desativar usuário' },
                    '500': { description: 'Erro interno do servidor' }
                }
                    
            },
            put: {
                tags: ['Categorias'],
                summary: 'Atualizar Todos',
                description: 'Método utilizado para atualizar uma categoria',
                security: [{ bearerAuth: [] }],
                parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'tipo_transacao', 'gasto_fixo', 'id_usuario', 'cor', 'icone'],
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: '#fff' },
                                    icone: { type: 'string', example: 'save' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Usuário atualizado com sucesso' },
                    '400': { description: 'Erro ao atualizar usuário' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            patch: {
                tags: ['Categorias'],
                summary: 'Atualizar categoria',
                description: 'Método utilizado para atualizar parcialmente uma categoria',
                security: [{ bearerAuth: [] }],
                parameters: [{
                    name: 'id',
                    in: 'path',
                    required: true,
                    schema: { type: 'integer' }
                }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    nome: { type: 'string', example: 'Alimentação' },
                                    tipo_transacao: { type: 'string', example: 'ENTRADA OU SAIDA' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_usuario: { type: 'integer', example: 1 },
                                    cor: { type: 'string', example: '#fff' },
                                    icone: { type: 'string', example: 'save' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Categoria atualizada com sucesso' },
                    '400': { description: 'Erro ao atualizar categoria' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
        },
        '/SubCategorias': {
            post: {
                tags: ['SubCategorias'],
                summary: 'Nova subCategoria',
                description: 'Rota para cadastrar uma nova subCategoria',
                security: [
                    { 
                        bearerAuth: [],
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['nome', 'gasto_fixo', 'id_categoria', 'cor', 'icone'],
                                properties: {
                                    nome: { type: 'string', example: 'McDonalds' },
                                    gasto_fixo: { type: 'boolean', example: true },
                                    id_categoria: { type: 'integer', example: 14 },
                                    cor: { type: 'string', example: '#fff' },
                                    icone: { type: 'string', example: 'save' },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': { description: 'Categoria cadastrada com sucesso' },
                    '400': { description: 'Erro ao cadastrar categoria' },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
            get: {
                tags: ['SubCategorias'],
                summary: 'Listar todos as subCategorias',
                description: 'Método utilizado para listar todos as subCategorias cadastrados',
                security: [{ bearerAuth: [] }],
                responses: {
                    '200': {
                        description: 'Lista de subCategorias',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            nome: { type: 'string', example: 'McDonalds' },
                                            gasto_fixo: { type: 'boolean', example: true },
                                            id_categoria: { type: 'integer', example: 14 },
                                            cor: { type: 'string', example: '#fff' },
                                            icone: { type: 'string', example: 'save' },
                                        }
                                    }
                                }
                            }
                        }
                    },
                    '500': { description: 'Erro interno do servidor' }
                }
            },
        },
        
    }
};

const options = {
    swaggerDefinition,
    apis: []
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;

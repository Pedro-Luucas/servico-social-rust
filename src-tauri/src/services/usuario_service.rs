use crate::dtos::create_usuario_dto::CreateUsuarioDto;
use crate::dtos::edit_usuario_dto::EditUsuarioDto;
use crate::models::usuario::Usuario;
use crate::repositories::usuario_repository::UsuarioRepository;
use sqlx::PgPool;
use uuid::Uuid;

pub struct UsuarioService;

impl UsuarioService {
    pub async fn create_usuario(pool: &PgPool, dto: CreateUsuarioDto) -> Result<(), sqlx::Error> {
        let id = Uuid::new_v4();
        let usuario = Usuario {
            id,
            nome: dto.nome,
            ativo: dto.ativo,
            cpf: dto.cpf,
            rg: dto.rg,
            data_nasc: dto.data_nasc,
            telefone: dto.telefone,
            profissao: dto.profissao,
            escolaridade: dto.escolaridade,
            patologia: dto.patologia,
            cep: dto.cep,
            municipio: dto.municipio,
            bairro: dto.bairro,
            rua: dto.rua,
            numero: dto.numero,
            referencia: dto.referencia,
            resp_nome: dto.resp_nome,
            resp_cpf: dto.resp_cpf,
            resp_idade: dto.resp_idade,
            resp_telefone: dto.resp_telefone,
            resp_profissao: dto.resp_profissao,
            resp_escolaridade: dto.resp_escolaridade,
            resp_parentesco: dto.resp_parentesco,
            resp_renda: dto.resp_renda,
            fonte_renda: dto.fonte_renda,
            valor_renda: dto.valor_renda,
            moradia: dto.moradia,
            moradia_valor: dto.moradia_valor,
            agua: dto.agua,
            agua_valor: dto.agua_valor,
            energia: dto.energia,
            energia_valor: dto.energia_valor,
            bens: dto.bens,
            internet: dto.internet,
            cras: dto.cras,
            acesso_cras: dto.acesso_cras,
            desc_doenca: dto.desc_doenca,
            medicamentos: dto.medicamentos,
            medicamentos_gasto: dto.medicamentos_gasto,
            tratamento: dto.tratamento,
            nutri: dto.nutri,
            tempo_tratamento: dto.tempo_tratamento,
            local: dto.local,
            encaminhamento: dto.encaminhamento,
            solicitacoes: dto.solicitacoes,
            observacoes: dto.observacoes,
            motivo_desligamento: dto.motivo_desligamento,
            parecer_social: dto.parecer_social,
            operador_id: dto.operador_id,
        };

        UsuarioRepository::save(pool, &usuario).await
    }

    pub async fn get_usuario_by_id(pool: &PgPool, id: Uuid) -> Result<Usuario, sqlx::Error> {
        UsuarioRepository::find_by_id(pool, id).await
    }

    pub async fn get_usuario_by_nome(
        pool: &PgPool,
        nome: &str,
    ) -> Result<Vec<Usuario>, sqlx::Error> {
        UsuarioRepository::find_by_nome(pool, nome).await
    }

    pub async fn get_usuario_by_telefone(
        pool: &PgPool,
        telefone: &str,
    ) -> Result<Vec<Usuario>, sqlx::Error> {
        UsuarioRepository::find_by_telefone(pool, telefone).await
    }

    pub async fn get_usuario_by_cep(pool: &PgPool, cep: &str) -> Result<Vec<Usuario>, sqlx::Error> {
        UsuarioRepository::find_by_cep(pool, cep).await
    }

    pub async fn get_usuario_by_cpf(pool: &PgPool, cpf: &str) -> Result<Vec<Usuario>, sqlx::Error> {
        UsuarioRepository::find_by_cpf(pool, cpf).await
    }

    pub async fn update_usuario(pool: &PgPool, dto: EditUsuarioDto) -> Result<(), sqlx::Error> {
        let id =
            Uuid::parse_str(&dto.id).map_err(|_| sqlx::Error::Decode("Invalid UUID".into()))?;
        UsuarioRepository::update(pool, id, dto).await
    }
}

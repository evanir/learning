require_relative 'estoque'
require_relative 'produto'

class Revista
  attr_reader :numero

  include Produto

  def initialize(titulo, preco, ano_lancamento, editora, numero)
    @titulo             = titulo
    @ano_lancamento     = ano_lancamento
    @preco              = calcula_preco(preco)
    @editora            = editora
    @numero             = numero
  end

  def matches?(query)
    %w[revista impresso].include? query
  end

  def possui_reimpressao?
    @possui_reimpressao
  end
end

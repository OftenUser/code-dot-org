require 'pg'
require 'singleton'
require 'cdo/aws/dms'

# A thin wrapper around PG, providing a mechanism to execute SQL commands on our AWS Redshift
# instance.
class RedshiftClient
  include Singleton
  class PostgreSQLQueryError < StandardError; end

  # See section on PQresultStatus in https://www.postgresql.org/docs/9.1/libpq-exec.html
  QUERY_SUCCESS_CODES = %w(
    PGRES_COMMAND_OK
    PGRES_TUPLES_OK
    PGRES_COPY_OUT
    PGRES_COPY_IN
    PGRES_COPY_BOTH
  ).freeze

  # We don't expect to actually receive this warning https://www.postgresql.org/docs/9.1/libpq-notice-processing.html
  QUERY_WARNING_CODES = %w(
    PGRES_NONFATAL_ERROR
  ).freeze

  QUERY_ERROR_CODES = %w(
    PGRES_EMPTY_QUERY
    PGRES_BAD_RESPONSE
    PGRES_FATAL_ERROR
  ).freeze

  def initialize
    port = 5439
    options = ''
    tty = ''
    dbname = 'dashboard'
    login = 'dev'
    @conn = PG::Connection.new(CDO.redshift_host, port, options, tty, dbname, login, CDO.redshift_password)
  end

  def exec(sql_query)
    result = @conn.exec(sql_query)
    # result_status is an undocumented method that returns the integer query status.
    # res_status is an undocumented method that returns the string identifier for a given integer query status.
    result_status = result.res_status(result.result_status)
    raise PostgreSQLQueryError.new(result_status) unless QUERY_SUCCESS_CODES.include? result_status
    result
  end
end

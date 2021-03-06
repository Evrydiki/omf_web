require 'omf_base/lobject'

module Thin
  # Overwrite thin's logging mix-in to work more nicely
  # with log4r
  #
  module Logging
    class << self
      attr_writer :trace, :debug, :silent

      def trace?;  !@silent && @trace  end
      def debug?;  !@silent && @debug  end
      def silent?;  @silent            end
    end

    # # Global silencer methods
    # def silent
      # Logging.silent?
    # end
    # def silent=(value)
      # Logging.silent = value
    # end

    # Log a message to the console
    def log(msg)
      _logger.info(msg)
    end
    module_function :log
    public :log
    alias :log_info log



    # Log a message to the console if tracing is activated
    def trace(msg=nil)
      ### DO NOT COMMIT!!!! Can't figure out where tracing is switched on
      return
      #####


      return unless msg
      _logger.debug(msg)
    end
    module_function :trace
    public :trace
    alias :log_trace trace

    # Log a message to the console if debugging is activated
    def debug(msg=nil)
      return unless msg
      _logger.debug(msg)
    end
    module_function :debug
    public :debug
    alias :log_debug debug

    # Log an error backtrace if debugging is activated
    #
    # Thin 1.3 uses one argument e
    # Thin 1.6 uses two argument message, e
    #
    # This patch will now support both cases
    def log_error(*args)
      e = args.last
      e ||= $!
      _logger.error(e)
    end
    module_function :log_error
    public :log_error

    def _logger()
      @logger ||= OMF::Base::Loggable.logger(:thin)
    end
  end
end

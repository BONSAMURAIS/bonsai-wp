class Singleton(type):
    """
    Metaclass implementing the Singleton design pattern.

    Ensures that only one instance of a given class exists at any time.
    Any attempt to instantiate a class using this metaclass will return
    the same existing instance.

    Example:
        Basic usage::

            >>> class Config(metaclass=Singleton):
            ...     def __init__(self, value):
            ...         self.value = value
            ...
            >>> a = Config("foo")
            >>> b = Config("bar")
            >>> a is b
            True
            >>> a.value, b.value
            ('foo', 'foo')

        You can optionally modify the `__call__` method (see commented
        section) to reinitialize the instance each time it is called.

    Attributes:
        _instances (dict[type, object]): A mapping of class references to
            their singleton instances. Each key is a class using this
            metaclass, and each value is its single instance.

    Methods:
        __call__(*args, **kwargs): Creates or returns the existing instance
            of the class.
        __repr__(): Returns a string representation of the metaclass and
            its stored attributes.
    """

    _instances = {}

    def __call__(cls, *args, **kwargs):
        """Create or return the existing instance of the class.

        If an instance of the class does not exist yet, it is created and
        stored in the `_instances` dictionary. Subsequent instantiations
        return the same existing instance.

        Args:
            *args: Positional arguments passed to the class constructor.
            **kwargs: Keyword arguments passed to the class constructor.

        Returns:
            object: The single existing instance of the class.
        """
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        # else: # call __init__ at each instanciation aka class()
        #     cls._instances[cls].__init__(*args, **kwargs)
        return cls._instances[cls]
    
    def __repr__(self):
        """Return a readable string representation of the metaclass instance.

        Returns:
            str: String containing the class name and its public attributes.
        """
        attrs = vars(self)
        attr_str = ', '.join(f"{k}={v!r}" for k, v in attrs.items() if not k.startswith('_'))
        return f"{self.__class__.__name__}({attr_str})"
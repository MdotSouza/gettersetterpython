class Test():
    def __init__(self, name, bdate):
        self.name = name
        self.__bdate = bdate

    def get_name(self):
        return self.name

    def set_name(self, new_name):
        self.name = new_name

    @property
    def bdate(self):
        return self.__bdate

    @bdate.setter
    def bdate(self, new_bdate):
        self._name = new_bdate

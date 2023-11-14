import React from "react";

const searchbackup = () => {
  return (
    <Formik
      onSubmit={handleFormikSearch}
      initialValues={
        isFileSearch ? initialFileSearchValues : initialFolderSearchValues
      }
      validationSchema={isFileSearch ? fileSearchSchema : folderSearchSchema}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-5"
        >
          <SearchIntro
            isFileSearch={isFileSearch}
            setIsFileSearch={setIsFileSearch}
          />

          {isFileSearch ? (
            <>
              {/* input container */}
              <div className="pointer-events-none w-full md:w-5/6 lg:4/6 flex items-center justify-start bg-slate-50 dark:bg-slate-800 shadow-xl hover:shadow-blue-200 focus-within:shadow-blue-200 dark:shadow-none rounded-full p-2 duration-300">
                {/* icon */}
                <div className="bg-blue-600 text-white text-2xl px-5 p-2 ml-1 rounded-full font-bold pointer-events-auto">
                  <LuFileSearch />
                </div>

                <input
                  type="text"
                  name="fileName"
                  id="fileName"
                  autoFocus={true}
                  value={values.fileName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter name of file..."
                  className="w-full bg-transparent py-1 px-4 hover:bg-opacity-40 duration-200 outline-none border-none text-[18px] pointer-events-auto"
                />

                {values.fileName && (
                  <div
                    onClick={() => {
                      resetForm();
                      setIsSearching(false);
                      setSearchedFiles([]);
                    }}
                    className="text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600 text-2xl px-5 p-2 ml-1 rounded-full cursor-pointer duration-300 pointer-events-auto"
                  >
                    <FiX />
                  </div>
                )}
              </div>
              {/* file name error */}
              <p className=" text-blue-500 text-left text-base duration-200 transition-all">
                {touched.fileName && errors.fileName}
              </p>
            </>
          ) : (
            <>
              {/* input container */}
              <div className="pointer-events-none w-full md:w-5/6 lg:4/6 flex items-center justify-start bg-slate-50 dark:bg-slate-800 shadow-xl hover:shadow-blue-200 focus-within:shadow-blue-200 dark:shadow-none rounded-full p-2 duration-300">
                {/* icon */}
                <div className="bg-blue-600 text-white text-2xl px-5 p-2 ml-1 rounded-full font-bold pointer-events-auto">
                  <LuFolderSearch />
                </div>

                <input
                  type="text"
                  name="folderName"
                  id="folderName"
                  autoFocus={true}
                  value={values.folderName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter name of file..."
                  className="w-full bg-transparent py-1 px-4 hover:bg-opacity-40 duration-200 outline-none border-none text-[18px] pointer-events-auto"
                />

                {values.folderName && (
                  <div
                    onClick={() => {
                      resetForm();
                      setIsSearching(false);
                      setSearchedFolders([]);
                    }}
                    className="text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-600 text-2xl px-5 p-2 ml-1 rounded-full cursor-pointer duration-300 pointer-events-auto"
                  >
                    <FiX />
                  </div>
                )}
              </div>
              {/* file name error */}
              <p className=" text-blue-500 text-left text-base duration-200 transition-all">
                {touched.folderName && errors.folderName}
              </p>
            </>
          )}
        </form>
      )}
    </Formik>
  );
};

export default searchbackup;
